import { assertEquals } from "../deps.ts";
import { AST } from "../parser/index.ts";
import compile from "./index.ts";

Deno.test("Doctype", () => {
  const ast = { type: "Doctype", data: "<!DOCTYPE html>", start: 0, end: 15 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<!DOCTYPE html>";

  assertEquals(output, expected);
});

Deno.test("Comment", () => {
  const ast = { type: "Comment", data: " Testing ", start: 0, end: 16 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<!-- Testing -->";

  assertEquals(output, expected);
});

Deno.test("Text", () => {
  const ast = { type: "Text", data: "This is ", start: 0, end: 8 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "This is ";

  assertEquals(output, expected);
});

Deno.test("Self Closing Tag", () => {
  const ast = {
    type: "Tag",
    data: "br",
    attributes: [],
    children: [],
    start: 0,
    end: 5,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<br>";

  assertEquals(output, expected);
});

Deno.test("Tag With No Children", () => {
  const ast = {
    type: "Tag",
    data: "ul",
    attributes: [],
    children: [],
    start: 0,
    end: 9,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<ul></ul>";

  assertEquals(output, expected);
});

Deno.test("Tag With Children", () => {
  const ast = {
    type: "Tag",
    data: "ul",
    attributes: [],
    children: [
      {
        type: "Tag",
        data: "li",
        attributes: [],
        children: [
          {
            type: "Text",
            data: "FOO",
            start: 8,
            end: 11,
          },
        ],
        start: 4,
        end: 16,
      },
      {
        type: "Tag",
        data: "li",
        attributes: [],
        children: [
          {
            type: "Text",
            data: "BAR",
            start: 20,
            end: 23,
          },
        ],
        start: 16,
        end: 28,
      },
    ],
    start: 0,
    end: 33,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<ul><li>FOO</li><li>BAR</li></ul>";

  assertEquals(output, expected);
});

Deno.test("Void Elements", () => {
  const ast = {
    type: "Tag",
    data: "meta",
    attributes: [
      {
        type: "Attribute",
        data: ' charset="UTF-8"',
        start: 5,
        end: 21,
        name: { type: "AttributeName", data: "charset", start: 6, end: 13 },
        value: {
          type: "AttributeValue",
          data: "UTF-8",
          start: 15,
          end: 22,
        },
      },
    ],
    children: [],
    start: 0,
    end: 22,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = '<meta charset="UTF-8">';

  assertEquals(output, expected);
});

Deno.test("Attribute", () => {
  const ast = {
    type: "Tag",
    data: "br",
    attributes: [
      {
        type: "Attribute",
        data: ' class="foo"',
        start: 3,
        end: 15,
        name: { type: "AttributeName", data: "class", start: 4, end: 9 },
        value: {
          type: "AttributeValue",
          data: "foo",
          start: 11,
          end: 16,
        },
      },
      {
        type: "Attribute",
        data: " disabled",
        start: 15,
        end: 24,
        name: {
          type: "AttributeName",
          data: "disabled",
          start: 16,
          end: 24,
        },
        value: { type: "AttributeValue", data: "", start: 24, end: 24 },
      },
    ],
    children: [],
    start: 0,
    end: 27,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = '<br class="foo" disabled>';

  assertEquals(output, expected);
});

Deno.test("Attribute Expression", () => {
  const ast = {
    type: "Tag",
    data: "div",
    attributes: [
      {
        type: "Attribute",
        data: ' lat="{latitude}"',
        start: 4,
        end: 21,
        name: { type: "AttributeName", data: "lat", start: 5, end: 8 },
        value: {
          type: "AttributeExpression",
          data: '"{latitude}"',
          expression: {
            type: "Identifier",
            data: "latitude",
            start: 11,
            end: 19,
          },
          start: 10,
          end: 20,
        },
      },
      {
        type: "Attribute",
        data: ' lng="{longitude}"',
        start: 21,
        end: 39,
        name: { type: "AttributeName", data: "lng", start: 22, end: 25 },
        value: {
          type: "AttributeExpression",
          data: '"{longitude}"',
          expression: {
            type: "Identifier",
            data: "longitude",
            start: 28,
            end: 37,
          },
          start: 27,
          end: 38,
        },
      },
      {
        type: "Attribute",
        data: " distance={10}",
        start: 39,
        end: 53,
        name: {
          type: "AttributeName",
          data: "distance",
          start: 40,
          end: 48,
        },
        value: {
          type: "AttributeExpression",
          data: "{10}",
          expression: {
            type: "Literal",
            data: "10",
            value: 10,
            start: 50,
            end: 52,
          },
          start: 49,
          end: 53,
        },
      },
    ],
    children: [],
    start: 0,
    end: 60,
  };
  const data = {
    latitude: 30.266666,
    longitude: -97.73333,
  };

  const output = compile(ast as AST, data);
  const expected = '<div lat="30.266666" lng="-97.73333" distance="10"></div>';

  assertEquals(output, expected);
});

Deno.test("Attribute Spread", () => {
  const ast = {
    type: "Tag",
    data: "div",
    attributes: [
      {
        type: "AttributeSpread",
        data: "{...map}",
        expression: { type: "Identifier", data: "map", start: 9, end: 12 },
        start: 5,
        end: 13,
      },
      {
        type: "Attribute",
        data: ' class="foo"',
        start: 13,
        end: 25,
        name: { type: "AttributeName", data: "class", start: 14, end: 19 },
        value: {
          type: "AttributeValue",
          data: "foo",
          start: 21,
          end: 26,
        },
      },
    ],
    children: [],
    start: 0,
    end: 28,
  };
  const data = {
    map: {
      lat: 30.266666,
      lng: -97.73333,
      distance: 10,
    },
  };

  const output = compile(ast as AST, data);
  const expected =
    '<div lat="30.266666" lng="-97.73333" distance="10" class="foo"></div>';

  assertEquals(output, expected);
});

Deno.test("Attribute Spread with Nested Object", () => {
  const ast = {
    type: "Tag",
    data: "div",
    attributes: [
      {
        type: "AttributeSpread",
        data: "{...map}",
        expression: { type: "Identifier", data: "map", start: 9, end: 12 },
        start: 5,
        end: 13,
      },
    ],
    children: [],
    start: 0,
    end: 25,
  };
  const data = {
    map: {
      lat: 30.266666,
      lng: -97.73333,
      distance: 10,
      nested: {
        foo: "bar",
      },
    },
  };

  const output = compile(ast as AST, data);
  const expected =
    '<div lat="30.266666" lng="-97.73333" distance="10" nested="[object Object]"></div>';

  assertEquals(output, expected);
});

Deno.test("Attribute Overrides (ordering)", () => {
  const ast = {
    type: "Tag",
    data: "div",
    attributes: [
      {
        type: "Attribute",
        data: ' lat="{latitude}"',
        start: 4,
        end: 21,
        name: { type: "AttributeName", data: "lat", start: 5, end: 8 },
        value: {
          type: "AttributeExpression",
          data: '"{latitude}"',
          expression: {
            type: "Identifier",
            data: "latitude",
            start: 11,
            end: 19,
          },
          start: 10,
          end: 20,
        },
      },
      {
        type: "Attribute",
        data: ' lng="{longitude}"',
        start: 21,
        end: 39,
        name: { type: "AttributeName", data: "lng", start: 22, end: 25 },
        value: {
          type: "AttributeExpression",
          data: '"{longitude}"',
          expression: {
            type: "Identifier",
            data: "longitude",
            start: 28,
            end: 37,
          },
          start: 27,
          end: 38,
        },
      },
      {
        type: "AttributeSpread",
        data: "{...map}",
        expression: { type: "Identifier", data: "map", start: 9, end: 12 },
        start: 5,
        end: 13,
      },
    ],
    children: [],
    start: 0,
    end: 25,
  };
  const data = {
    latitude: -12.213123,
    longitude: 5.123121,
    map: {
      lat: 30.266666,
      lng: -97.73333,
      distance: 10,
    },
  };

  const output = compile(ast as AST, data);
  const expected = '<div lat="30.266666" lng="-97.73333" distance="10"></div>';

  assertEquals(output, expected);
});

Deno.test("Script Tag", () => {
  const ast = {
    type: "Tag",
    data: "script",
    attributes: [],
    children: [
      {
        type: "Text",
        data: "console.log('hello world');",
        start: 8,
        end: 35,
      },
    ],
    start: 0,
    end: 44,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "<script>console.log('hello world');</script>";

  assertEquals(output, expected);
});

Deno.test("Style Tag", () => {
  const ast = {
    type: "Tag",
    data: "style",
    attributes: [],
    children: [
      {
        type: "Text",
        data:
          ".border { border: 1px solid transparent; } .border-blue-100 { border-color: #3434; }",
        start: 7,
        end: 91,
      },
    ],
    start: 0,
    end: 99,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected =
    "<style>.border { border: 1px solid transparent; } .border-blue-100 { border-color: #3434; }</style>";

  assertEquals(output, expected);
});

Deno.test("Textarea Tag", () => {
  const ast = {
    type: "Tag",
    data: "textarea",
    attributes: [
      {
        type: "Attribute",
        data: ' class="border border-blue-100"',
        start: 9,
        end: 40,
        name: { type: "AttributeName", data: "class", start: 10, end: 15 },
        value: {
          type: "AttributeValue",
          data: "border border-blue-100",
          start: 17,
          end: 41,
        },
      },
      {
        type: "Attribute",
        data: ' rows="5"',
        start: 40,
        end: 49,
        name: { type: "AttributeName", data: "rows", start: 41, end: 45 },
        value: { type: "AttributeValue", data: "5", start: 47, end: 50 },
      },
      {
        type: "Attribute",
        data: ' cols="33"',
        start: 49,
        end: 59,
        name: { type: "AttributeName", data: "cols", start: 50, end: 54 },
        value: { type: "AttributeValue", data: "33", start: 56, end: 60 },
      },
    ],
    children: [
      {
        type: "Text",
        data:
          "\n        It was a dark and stormy night...\n        and lighting was striking all around.\n        Thunder clapped the sky so hard it made my ears ring.\n     ",
        start: 60,
        end: 216,
      },
    ],
    start: 0,
    end: 227,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = `<textarea class="border border-blue-100" rows="5" cols="33">
        It was a dark and stormy night...
        and lighting was striking all around.
        Thunder clapped the sky so hard it made my ears ring.
     </textarea>`;

  assertEquals(output, expected);
});

Deno.test("Element Directive", () => {
  const ast = {
    type: "ElementDirective",
    data: ":element",
    attributes: [
      {
        type: "Attribute",
        data: ' class="foo"',
        start: 18,
        end: 30,
        name: { type: "AttributeName", data: "class", start: 19, end: 24 },
        value: {
          type: "AttributeValue",
          data: "foo",
          start: 26,
          end: 31,
        },
      },
    ],
    children: [{ type: "Text", data: "Dynamic Heading", start: 31, end: 46 }],
    expression: {
      type: "Literal",
      data: '"h2"',
      value: "h2",
      start: 15,
      end: 19,
    },
    start: 0,
    end: 57,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = '<h2 class="foo">Dynamic Heading</h2>';

  assertEquals(output, expected);
});

Deno.test("Identifier", () => {
  const ast = { type: "Identifier", data: "foobar", start: 26, end: 32 };
  const data = {
    foobar: "barfoo",
  };

  const output = compile(ast as AST, data);
  const expected = "barfoo";

  assertEquals(output, expected);
});

Deno.test("Identifier with Bad Data", () => {
  const ast = { type: "Identifier", data: "foobar", start: 26, end: 32 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "undefined";

  assertEquals(output, expected);
});

Deno.test("Literal (int)", () => {
  const ast = { type: "Literal", data: "4", value: 4, start: 9, end: 10 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "4";

  assertEquals(output, expected);
});

Deno.test("Literal (float)", () => {
  const ast = { type: "Literal", data: "4.5", value: 4.5, start: 9, end: 12 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "4.5";

  assertEquals(output, expected);
});

Deno.test("Literal (boolean)", () => {
  const ast = { type: "Literal", data: "true", value: true, start: 9, end: 13 };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "true";

  assertEquals(output, expected);
});

Deno.test("Literal (string)", () => {
  const ast = {
    type: "Literal",
    data: "'work'",
    value: "work",
    start: 9,
    end: 16,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "work";

  assertEquals(output, expected);
});

Deno.test("Member Expression", () => {
  const ast = {
    type: "MemberExpression",
    data: "foo.bar",
    object: { type: "Identifier", data: "foo", start: 26, end: 29 },
    property: { type: "Identifier", data: "bar", start: 30, end: 33 },
    start: 26,
    end: 33,
  };
  const data = {
    foo: {
      bar: "foobar",
    },
  };

  const output = compile(ast as AST, data);
  const expected = "foobar";

  assertEquals(output, expected);
});

Deno.test("Nested Member Expression", () => {
  const ast = {
    type: "MemberExpression",
    data: "nested.as[0].many.times",
    object: {
      type: "MemberExpression",
      data: "nested.as[0].many",
      object: {
        type: "MemberExpression",
        data: "nested.as[0]",
        object: {
          type: "MemberExpression",
          data: "nested.as",
          object: {
            type: "Identifier",
            data: "nested",
            start: 72,
            end: 78,
          },
          property: { type: "Identifier", data: "as", start: 79, end: 81 },
          start: 72,
          end: 81,
        },
        property: {
          type: "Literal",
          data: "0",
          value: 0,
          start: 82,
          end: 83,
        },
        start: 71,
        end: 83,
      },
      property: { type: "Identifier", data: "many", start: 85, end: 89 },
      start: 71,
      end: 89,
    },
    property: { type: "Identifier", data: "times", start: 90, end: 95 },
    start: 71,
    end: 95,
  };
  const data = {
    nested: {
      as: [
        {
          many: {
            times: "success",
          },
          few: {
            times: "failure",
          },
        },
        {
          many: {
            times: "failure",
          },
        },
      ],
    },
  };

  const output = compile(ast as AST, data);
  const expected = "success";

  assertEquals(output, expected);
});

Deno.test("Nested Member Expression with Bad Data", () => {
  const ast = {
    type: "MemberExpression",
    data: "nested.as[0].many.times",
    object: {
      type: "MemberExpression",
      data: "nested.as[0].many",
      object: {
        type: "MemberExpression",
        data: "nested.as[0]",
        object: {
          type: "MemberExpression",
          data: "nested.as",
          object: {
            type: "Identifier",
            data: "nested",
            start: 72,
            end: 78,
          },
          property: { type: "Identifier", data: "as", start: 79, end: 81 },
          start: 72,
          end: 81,
        },
        property: {
          type: "Literal",
          data: "0",
          value: 0,
          start: 82,
          end: 83,
        },
        start: 71,
        end: 83,
      },
      property: { type: "Identifier", data: "many", start: 85, end: 89 },
      start: 71,
      end: 89,
    },
    property: { type: "Identifier", data: "times", start: 90, end: 95 },
    start: 71,
    end: 95,
  };
  const data = {};

  const output = compile(ast as AST, data);
  const expected = "undefined";

  assertEquals(output, expected);
});

Deno.test("Unary Expression", () => {
  const ast = {
    type: "UnaryExpression",
    data: "!",
    prefix: true,
    operator: "!",
    argument: { type: "Identifier", data: "foo", start: 16, end: 19 },
    start: 15,
    end: 16,
  };
  const data = { foo: true };

  const output = compile(ast as AST, data);
  const expected = "false";

  assertEquals(output, expected);
});

Deno.test("Update Expression (prefix)", () => {
  const ast = {
    type: "UpdateExpression",
    data: "++",
    prefix: true,
    operator: "++",
    argument: { type: "Identifier", data: "foo", start: 17, end: 20 },
    start: 15,
    end: 17,
  };
  const data = { foo: 100 };

  const output = compile(ast as AST, data);
  const expected = "101";

  assertEquals(output, expected);
});

Deno.test("Update Expression (postfix)", () => {
  const ast = {
    type: "UpdateExpression",
    data: "++",
    prefix: false,
    operator: "++",
    argument: { type: "Identifier", data: "go", start: 33, end: 35 },
    start: 35,
    end: 37,
  };
  const data = { go: 25 };

  const output = compile(ast as AST, data);
  const expected = "26";

  assertEquals(output, expected);
});

Deno.test("Binary Expression", () => {
  const ast = {
    type: "BinaryExpression",
    data: "===",
    left: { type: "Identifier", data: "foo", start: 18, end: 21 },
    operator: "===",
    right: {
      type: "Literal",
      data: "'foo'",
      value: "foo",
      start: 26,
      end: 31,
    },
    start: 18,
    end: 31,
  };
  const data = { foo: "foo" };

  const output = compile(ast as AST, data);
  const expected = "true";

  assertEquals(output, expected);
});

Deno.test("Logical Expression", () => {
  const ast = {
    type: "LogicalExpression",
    data: "&&",
    left: { type: "Identifier", data: "foo", start: 15, end: 18 },
    operator: "&&",
    right: { type: "Identifier", data: "bar", start: 22, end: 25 },
    start: 15,
    end: 25,
  };
  const data = { foo: true, bar: false };

  const output = compile(ast as AST, data);
  const expected = "false";

  assertEquals(output, expected);
});

Deno.test("If Block (true)", () => {
  const ast = {
    type: "IfBlock",
    data: ":if",
    children: [
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 20,
            end: 33,
            name: {
              type: "AttributeName",
              data: "class",
              start: 21,
              end: 26,
            },
            value: {
              type: "AttributeValue",
              data: "test",
              start: 28,
              end: 34,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 34, end: 52 },
        ],
        start: 16,
        end: 58,
      },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 5,
      end: 15,
    },
    else: null,
    start: 0,
    end: 64,
  };
  const data = { expression: true };

  const output = compile(ast as AST, data);
  const expected = '<div class="test">Testing Expression</div>';

  assertEquals(output.trim(), expected);
});

Deno.test("If Block (false)", () => {
  const ast = {
    type: "IfBlock",
    data: ":if",
    children: [
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 20,
            end: 33,
            name: {
              type: "AttributeName",
              data: "class",
              start: 21,
              end: 26,
            },
            value: {
              type: "AttributeValue",
              data: "test",
              start: 28,
              end: 34,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 34, end: 52 },
        ],
        start: 16,
        end: 58,
      },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 5,
      end: 15,
    },
    else: null,
    start: 0,
    end: 64,
  };
  const data = { expression: false };

  const output = compile(ast as AST, data);
  const expected = "";

  assertEquals(output.trim(), expected);
});

Deno.test("If Else Block (else)", () => {
  const ast = {
    type: "IfBlock",
    data: ":if",
    children: [
      { type: "Text", data: "\n      ", start: 21, end: 28 },
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 32,
            end: 45,
            name: {
              type: "AttributeName",
              data: "class",
              start: 33,
              end: 38,
            },
            value: {
              type: "AttributeValue",
              data: "test",
              start: 40,
              end: 46,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 46, end: 64 },
        ],
        start: 28,
        end: 70,
      },
      { type: "Text", data: "\n    ", start: 70, end: 75 },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 10,
      end: 20,
    },
    else: {
      type: "ElseBlock",
      data: ":else",
      children: [
        { type: "Text", data: "\n      ", start: 82, end: 89 },
        {
          type: "Tag",
          data: "p",
          attributes: [
            {
              type: "Attribute",
              data: ' class="what"',
              start: 91,
              end: 104,
              name: {
                type: "AttributeName",
                data: "class",
                start: 92,
                end: 97,
              },
              value: {
                type: "AttributeValue",
                data: "what",
                start: 99,
                end: 105,
              },
            },
          ],
          children: [
            { type: "Text", data: "Foo Bar", start: 105, end: 112 },
            {
              type: "Tag",
              data: "span",
              attributes: [],
              children: [{ type: "Text", data: "!", start: 118, end: 119 }],
              start: 112,
              end: 126,
            },
          ],
          start: 89,
          end: 130,
        },
        { type: "Text", data: "\n    ", start: 130, end: 135 },
      ],
      start: 75,
      end: 135,
    },
    start: 5,
    end: 141,
  };
  const data = { expression: false };

  const output = compile(ast as AST, data);
  const expected = '<p class="what">Foo Bar<span>!</span></p>';

  assertEquals(output.trim(), expected);
});

Deno.test("If ElseIf Else Block (ElseIf)", () => {
  const ast = {
    type: "IfBlock",
    data: ":if",
    children: [
      { type: "Text", data: "\n      ", start: 21, end: 28 },
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 32,
            end: 45,
            name: {
              type: "AttributeName",
              data: "class",
              start: 33,
              end: 38,
            },
            value: {
              type: "AttributeValue",
              data: "test",
              start: 40,
              end: 46,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 46, end: 64 },
        ],
        start: 28,
        end: 70,
      },
      { type: "Text", data: "\n    ", start: 70, end: 75 },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 10,
      end: 20,
    },
    else: {
      type: "ElseIfBlock",
      data: ":elseif",
      children: [
        { type: "Text", data: "\n      ", start: 97, end: 104 },
        {
          type: "Tag",
          data: "br",
          attributes: [],
          children: [],
          start: 104,
          end: 108,
        },
        { type: "Text", data: "\n    ", start: 108, end: 113 },
      ],
      expression: {
        type: "Identifier",
        data: "expression2",
        start: 84,
        end: 95,
      },
      else: {
        type: "ElseBlock",
        data: ":else",
        children: [
          { type: "Text", data: "\n      ", start: 120, end: 127 },
          {
            type: "Tag",
            data: "p",
            attributes: [
              {
                type: "Attribute",
                data: ' class="what"',
                start: 129,
                end: 142,
                name: {
                  type: "AttributeName",
                  data: "class",
                  start: 130,
                  end: 135,
                },
                value: {
                  type: "AttributeValue",
                  data: "what",
                  start: 137,
                  end: 143,
                },
              },
            ],
            children: [
              { type: "Text", data: "Foo Bar", start: 143, end: 150 },
              {
                type: "Tag",
                data: "span",
                attributes: [],
                children: [{ type: "Text", data: "!", start: 156, end: 157 }],
                start: 150,
                end: 164,
              },
            ],
            start: 127,
            end: 168,
          },
          { type: "Text", data: "\n    ", start: 168, end: 173 },
        ],
        start: 113,
        end: 173,
      },
      start: 75,
      end: 113,
    },
    start: 5,
    end: 179,
  };
  const data = { expression: false, expression2: true };

  const output = compile(ast as AST, data);
  const expected = "<br>";

  assertEquals(output.trim(), expected);
});

Deno.test("Skip Block (false)", () => {
  const ast = {
    type: "SkipBlock",
    data: ":skip",
    children: [
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 34,
            end: 47,
            name: {
              type: "AttributeName",
              data: "class",
              start: 35,
              end: 40,
            },
            value: {
              type: "AttributeValue",
              data: "test",
              start: 42,
              end: 48,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 48, end: 66 },
        ],
        start: 30,
        end: 72,
      },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 12,
      end: 22,
    },
    start: 5,
    end: 133,
  };
  const data = { expression: false };

  const output = compile(ast as AST, data);
  const expected = '<div class="test">Testing Expression</div>';

  assertEquals(output.trim(), expected);
});

Deno.test("Skip Block (true)", () => {
  const ast = {
    type: "SkipBlock",
    data: ":skip",
    children: [
      {
        type: "Tag",
        data: "div",
        attributes: [
          {
            type: "Attribute",
            data: ' class="test"',
            start: 34,
            end: 47,
            name: {
              type: "AttributeName",
              data: "class",
              start: 35,
              end: 40,
            },
            value: {
              type: "AttributeValue",
              data: '"test"',
              start: 42,
              end: 48,
            },
          },
        ],
        children: [
          { type: "Text", data: "Testing Expression", start: 48, end: 66 },
        ],
        start: 30,
        end: 72,
      },
    ],
    expression: {
      type: "Identifier",
      data: "expression",
      start: 12,
      end: 22,
    },
    start: 5,
    end: 133,
  };
  const data = { expression: true };

  const output = compile(ast as AST, data);
  const expected = "";

  assertEquals(output.trim(), expected);
});

Deno.test("WhenBlock / IsBlock (caught in IsBlock)", () => {
  const ast = {
    type: "WhenBlock",
    data: ":when",
    children: [
      { type: "Text", data: "\n      ", start: 19, end: 26 },
      {
        type: "IsBlock",
        data: ":is",
        children: [
          { type: "Text", data: "\n        ", start: 38, end: 47 },
          {
            type: "Tag",
            data: "div",
            attributes: [
              {
                type: "Attribute",
                data: ' class="test"',
                start: 51,
                end: 64,
                name: {
                  type: "AttributeName",
                  data: "class",
                  start: 52,
                  end: 57,
                },
                value: {
                  type: "AttributeValue",
                  data: "test",
                  start: 59,
                  end: 65,
                },
              },
            ],
            children: [
              {
                type: "Text",
                data: "Testing Expression",
                start: 65,
                end: 83,
              },
            ],
            start: 47,
            end: 89,
          },
          { type: "Text", data: "\n      ", start: 89, end: 96 },
        ],
        expression: {
          type: "Literal",
          data: '"cake"',
          value: "cake",
          start: 31,
          end: 37,
        },
        start: 26,
        end: 96,
      },
      {
        type: "IsBlock",
        data: ":is",
        children: [
          { type: "Text", data: "\n        ", start: 107, end: 116 },
          {
            type: "Tag",
            data: "br",
            attributes: [],
            children: [],
            start: 116,
            end: 120,
          },
          { type: "Text", data: "\n      ", start: 120, end: 127 },
        ],
        expression: {
          type: "Literal",
          data: '"pie"',
          value: "pie",
          start: 101,
          end: 106,
        },
        start: 96,
        end: 127,
      },
      {
        type: "ElseBlock",
        data: ":else",
        children: [
          { type: "Text", data: "\n        ", start: 134, end: 143 },
          {
            type: "Tag",
            data: "p",
            attributes: [
              {
                type: "Attribute",
                data: ' class="what"',
                start: 145,
                end: 158,
                name: {
                  type: "AttributeName",
                  data: "class",
                  start: 146,
                  end: 151,
                },
                value: {
                  type: "AttributeValue",
                  data: "what",
                  start: 153,
                  end: 159,
                },
              },
            ],
            children: [
              { type: "Text", data: "Foo Bar", start: 159, end: 166 },
              {
                type: "Tag",
                data: "span",
                attributes: [],
                children: [{ type: "Text", data: "!", start: 172, end: 173 }],
                start: 166,
                end: 180,
              },
            ],
            start: 143,
            end: 184,
          },
          { type: "Text", data: "\n    ", start: 184, end: 189 },
        ],
        start: 127,
        end: 189,
      },
    ],
    expression: { type: "Identifier", data: "desert", start: 12, end: 18 },
    start: 5,
    end: 197,
  };
  const data = { desert: "cake" };

  const output = compile(ast as AST, data);
  const expected = '<div class="test">Testing Expression</div>';

  assertEquals(output.trim(), expected);
});

Deno.test("WhenBlock / IsBlock (caught in ElseBlock)", () => {
  const ast = {
    type: "WhenBlock",
    data: ":when",
    children: [
      { type: "Text", data: "\n      ", start: 19, end: 26 },
      {
        type: "IsBlock",
        data: ":is",
        children: [
          { type: "Text", data: "\n        ", start: 38, end: 47 },
          {
            type: "Tag",
            data: "div",
            attributes: [
              {
                type: "Attribute",
                data: ' class="test"',
                start: 51,
                end: 64,
                name: {
                  type: "AttributeName",
                  data: "class",
                  start: 52,
                  end: 57,
                },
                value: {
                  type: "AttributeValue",
                  data: "test",
                  start: 59,
                  end: 65,
                },
              },
            ],
            children: [
              {
                type: "Text",
                data: "Testing Expression",
                start: 65,
                end: 83,
              },
            ],
            start: 47,
            end: 89,
          },
          { type: "Text", data: "\n      ", start: 89, end: 96 },
        ],
        expression: {
          type: "Literal",
          data: '"cake"',
          value: "cake",
          start: 31,
          end: 37,
        },
        start: 26,
        end: 96,
      },
      {
        type: "IsBlock",
        data: ":is",
        children: [
          { type: "Text", data: "\n        ", start: 107, end: 116 },
          {
            type: "Tag",
            data: "br",
            attributes: [],
            children: [],
            start: 116,
            end: 120,
          },
          { type: "Text", data: "\n      ", start: 120, end: 127 },
        ],
        expression: {
          type: "Literal",
          data: '"pie"',
          value: "pie",
          start: 101,
          end: 106,
        },
        start: 96,
        end: 127,
      },
      {
        type: "ElseBlock",
        data: ":else",
        children: [
          { type: "Text", data: "\n        ", start: 134, end: 143 },
          {
            type: "Tag",
            data: "p",
            attributes: [
              {
                type: "Attribute",
                data: ' class="what"',
                start: 145,
                end: 158,
                name: {
                  type: "AttributeName",
                  data: "class",
                  start: 146,
                  end: 151,
                },
                value: {
                  type: "AttributeValue",
                  data: "what",
                  start: 153,
                  end: 159,
                },
              },
            ],
            children: [
              { type: "Text", data: "No Cake", start: 159, end: 166 },
              {
                type: "Tag",
                data: "span",
                attributes: [],
                children: [{ type: "Text", data: "!", start: 172, end: 173 }],
                start: 166,
                end: 180,
              },
            ],
            start: 143,
            end: 184,
          },
          { type: "Text", data: "\n    ", start: 184, end: 189 },
        ],
        start: 127,
        end: 189,
      },
    ],
    expression: { type: "Identifier", data: "desert", start: 12, end: 18 },
    start: 5,
    end: 197,
  };
  const data = { desert: "steak" };

  const output = compile(ast as AST, data);
  const expected = '<p class="what">No Cake<span>!</span></p>';

  assertEquals(output.trim(), expected);
});
