import { bold, cyan } from "../../deps.ts";
import type { ComponentResponse, CacheKey } from "../types.ts";
import { cache, getCacheKey } from "../cache/index.ts";
import { Parser } from "../parser/index.ts";
import config from "../config/index.ts";

export const resolveComponent = async (
  name: string,
): Promise<ComponentResponse> => {
  // Determine correct path to process under
  const htmlPath = `${config.root}/components/${name}.html`;
  const seedPath = `${config.root}/components/${name}.seed`;
  const localPath = await Deno.lstat(htmlPath)
    .then(() => {
      return htmlPath;
    })
    .catch(async () => {
      return await Deno.lstat(seedPath)
        .then(() => {
          return seedPath;
        })
        .catch((e) => {
          return "";
        });
    });

  // Local Check failed, check for Remote Components
  const tsPath = `${config.root}/components/${name}.ts`;
  const jsPath = `${config.root}/components/${name}.js`;
  let importPath;

  if (!localPath) {
    importPath = await Deno.lstat(tsPath)
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
              `Invalid use argument for component directive ${
                bold(
                  cyan(name),
                )
              }, file not found`,
            );
          });
      });
  }

  // Generate Cache Key (v5 UUID)
  let cacheKey;
  if (localPath) {
    cacheKey = getCacheKey(localPath, "component", name);
  } else if (importPath) {
    cacheKey = getCacheKey(importPath, "component", name);
  }

  // Either return from Cache or Request New Data
  if (!cache.has(cacheKey as CacheKey)) {
    try {
      let component;

      if (localPath) {
        // Local Component
        component = await Deno.readTextFile(localPath);
      } else if (importPath) {
        // Remote Component
        // deno-lint-ignore no-undef TODO: remove when bug in 1.4.0 is resolved
        const path = await import(importPath).then((c) => {
          if (!c.default) {
            throw new Error(
              `Remote component path not exported as default for ${
                bold(
                  cyan(name),
                )
              }`,
            );
          }

          return c.default;
        });
        const response = await fetch(path);
        component = await response.text();
      }

      if (!component) {
        throw new Error(
          `Could not resolve component directive ${
            bold(
              cyan(name),
            )
          }, request for file failed`,
        );
      }

      // Parse AST for Component
      const p = new Parser(component, "Component");
      const result = p.parse();

      // Cache and Return
      cache.set(cacheKey as CacheKey, result);
      return Promise.resolve({
        ast: result,
        meta: {
          cacheHit: false,
          cacheKey,
          file: (localPath) ? localPath : importPath,
        },
      }) as Promise<ComponentResponse>;
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.resolve({
      ast: cache.get(cacheKey as CacheKey),
      meta: {
        cacheHit: true,
        cacheKey,
        file: (localPath) ? localPath : importPath,
      },
    }) as Promise<ComponentResponse>;
  }
};
