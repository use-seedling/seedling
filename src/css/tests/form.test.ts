import { assertEquals } from "../../../deps.ts";
import TailwindGenerator from "../index.ts";

Deno.test("(CSS) Form Input", () => {
  const css = new Set([
    "form-input",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
}
.form-input::-moz-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-input:-ms-input-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-input::-ms-input-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-input::placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-input:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Form Textarea", () => {
  const css = new Set([
    "form-textarea",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
}
.form-textarea::-moz-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-textarea:-ms-input-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-textarea::-ms-input-placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-textarea::placeholder {
  color: #9fa6b2;
  opacity: 1;
}
.form-textarea:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Form Multiselect", () => {
  const css = new Set([
    "form-multiselect",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-multiselect {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
}
.form-multiselect:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Form Select", () => {
  const css = new Set([
    "form-select",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  background-repeat: no-repeat;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding-top: 0.5rem;
  padding-right: 2.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}
.form-select::-ms-expand {
  color: #9fa6b2;
  border: none;
}
@media not print {
  .form-select::-ms-expand {
    display: none;
  }
}
@media print and (-ms-high-contrast: active),
  print and (-ms-high-contrast: none) {
  .form-select {
    padding-right: 0.75rem;
  }
}
.form-select:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Form Checkbox", () => {
  const css = new Set([
    "form-checkbox",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
@media not print {
  .form-checkbox::-ms-check {
    border-width: 1px;
    color: transparent;
    background: inherit;
    border-color: inherit;
    border-radius: inherit;
  }
}
.form-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #3f83f8;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.25rem;
}
.form-checkbox:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
.form-checkbox:checked:focus {
  border-color: transparent;
}
  `;

  assertEquals(output.trim(), expected.trim());
});

Deno.test("(CSS) Form Radio", () => {
  const css = new Set([
    "form-radio",
  ]);

  const t = new TailwindGenerator();
  t.addClasses(css);
  const output = t.getStylesheet();

  const expected = `
.form-radio:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
@media not print {
  .form-radio::-ms-check {
    border-width: 1px;
    color: transparent;
    background: inherit;
    border-color: inherit;
    border-radius: inherit;
  }
}
.form-radio {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  border-radius: 100%;
  height: 1rem;
  width: 1rem;
  color: #3f83f8;
  background-color: #fff;
  border-color: #d2d6dc;
  border-width: 1px;
}
.form-radio:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}
.form-radio:checked:focus {
  border-color: transparent;
}
  `;

  assertEquals(output.trim(), expected.trim());
});
