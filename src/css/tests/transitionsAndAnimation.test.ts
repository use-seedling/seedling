import { assertEquals } from "../../../deps.ts";
import TailwindGenerator from "../index.ts";

Deno.test("(CSS) Transition Property", () => {
  const css = new Set([
    "transition-none",
    "transition-all",
    "transition",
    "transition-colors",
    "transition-opacity",
    "transition-shadow",
    "transition-transform",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.transition-none {
  transition-property: none;
}
.transition-all {
  transition-property: all;
}
.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
}
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}
.transition-opacity {
  transition-property: opacity
}
.transition-shadow {
  transition-property: box-shadow;
}
.transition-transform {
  transition-property: transform;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Transition Duration", () => {
  const css = new Set([
    "duration-75",
    "duration-100",
    "duration-150",
    "duration-200",
    "duration-300",
    "duration-500",
    "duration-700",
    "duration-1000",
    "duration-3500",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.duration-75 {
  transition-duration: 75ms;
}
.duration-100 {
  transition-duration: 100ms;
}
.duration-150 {
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.duration-500 {
  transition-duration: 500ms;
}
.duration-700 {
  transition-duration: 700ms;
}
.duration-1000 {
  transition-duration: 1000ms;
}
.duration-3500 {
  transition-duration: 3500ms;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Transition Timing Function", () => {
  const css = new Set([
    "ease-linear",
    "ease-in",
    "ease-out",
    "ease-in-out",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.ease-linear {
  transition-timing-function: linear;
}
.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Transition Delay", () => {
  const css = new Set([
    "delay-75",
    "delay-100",
    "delay-150",
    "delay-200",
    "delay-300",
    "delay-500",
    "delay-700",
    "delay-1000",
    "delay-3500",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.delay-75 {
  transition-delay: 75ms;
}
.delay-100 {
  transition-delay: 100ms;
}
.delay-150 {
  transition-delay: 150ms;
}
.delay-200 {
  transition-delay: 200ms;
}
.delay-300 {
  transition-delay: 300ms;
}
.delay-500 {
  transition-delay: 500ms;
}
.delay-700 {
  transition-delay: 700ms;
}
.delay-1000 {
  transition-delay: 1000ms;
}
.delay-3500 {
  transition-delay: 3500ms;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Animation", () => {
  const css = new Set([
    "animate-none",
    "animate-spin",
    "animate-ping",
    "animate-pulse",
    "animate-bounce",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.animate-none {
  animation: none;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ping {
  100%,
  75% {
    transform: scale(2);
    opacity: 0;
  }
}
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
  `;

  assertEquals(output.trim(), expected.trim());
});
