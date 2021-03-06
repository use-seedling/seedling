import { delay } from "../../deps.ts";
import type {
  Skip,
  End,
  Success,
  Retry,
  DataResponse,
  Error,
  Request,
  Response,
  CacheKey,
} from "../types.ts";
import { cache, getCacheKey } from "../cache/index.ts";
import config from "../config/index.ts";

const skip = (response: Record<string, unknown>): Skip => ({
  type: "SKIP",
  response,
});

const end = (response: Record<string, unknown>): End => ({
  type: "END",
  response,
});

const success = (response: Record<string, unknown>): Success => ({
  type: "SUCCESS",
  response,
});

const retry = (msg: string, delay = 1000): Retry => ({
  type: "RETRY",
  msg,
  delay,
});

const error = (msg: string, stack?: TypeError): Error => ({
  type: "ERROR",
  msg,
  stack,
});

const response: Response = {
  skip,
  end,
  retry,
  error,
  success,
};

const buildRequest = (
  attrs: Record<string, unknown> = {},
  body = "",
): Request => ({
  attrs,
  body,
  root: config.root,
});

export const resolveData = async (
  processor: string,
  attrs: Record<string, unknown>,
  body = "",
): Promise<DataResponse> => {
  // Determine correct path to process under
  const tsPath = `${config.root}/data/${processor}.ts`;
  const jsPath = `${config.root}/data/${processor}.js`;
  const importPath = await Deno.lstat(tsPath)
    .then(() => {
      return tsPath;
    })
    .catch(async () => {
      return await Deno.lstat(jsPath)
        .then(() => {
          return jsPath;
        })
        .catch((e) => {
          throw new Error(
            "Invalid use argument for data directive, file not found",
          );
        });
    });

  // Generate Cache Key (v5 UUID)
  const cacheKey = getCacheKey(importPath, "data", processor, attrs, body);

  // Either return from Cache or Request New Data
  if (!cache.has(cacheKey as CacheKey)) {
    try {
      let retries = 0;
      // deno-lint-ignore no-undef TODO: remove when bug in 1.4.0 is resolved
      const dataProcessor = await import(importPath);
      let result;

      while (retries < 4) {
        result = await dataProcessor.default(
          buildRequest(attrs, body),
          response,
        );

        // Handle Retry and Errors
        if (result.type === "RETRY") {
          console.log(result.msg);
          retries++;
          await delay(result.delay);
          continue;
        } else if (result.type === "ERROR") {
          return Promise.reject(result);
        } else if (result.response !== undefined) {
          // Ensure request is not malformed
          break;
        } else {
          return Promise.reject(
            error("Something went wrong with the response, invalid structure"),
          );
        }
      }

      // Exceeded Retries
      if (result.type === "RETRY") {
        return Promise.reject("Reached max number of retries");
      }

      // Cache and Return
      cache.set(cacheKey as CacheKey, result);
      return Promise.resolve({
        ...result,
        retries,
        meta: { cacheHit: false, cacheKey, file: importPath },
      }) as Promise<DataResponse>;
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.resolve({
      ...cache.get(cacheKey as CacheKey),
      retries: 0,
      meta: { cacheHit: true, cacheKey, file: importPath },
    }) as Promise<DataResponse>;
  }
};
