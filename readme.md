# ms

> GSB Mode A green init snapshot from [vercel/ms](https://github.com/vercel/ms) @ `1c6264b795492e8fdecbc82cb8802fcfbfc08d26` (MIT). Upstream license retained.

![CI](https://github.com/vercel/ms/workflows/CI/badge.svg)

Use this package to easily convert various time formats to milliseconds.

## Examples

```js
ms('2 days')  // 172800000
ms('1d')      // 86400000
ms('10h')     // 36000000
ms('2.5 hrs') // 9000000
ms('2h')      // 7200000
ms('1m')      // 60000
ms('5s')      // 5000
ms('1y')      // 31557600000
ms('100')     // 100
ms('-3 days') // -259200000
ms('-1h')     // -3600000
ms('-200')    // -200
```

### Convert from Milliseconds

```js
ms(60000)             // "1m"
ms(2 * 60000)         // "2m"
ms(-3 * 60000)        // "-3m"
ms(ms('10 hours'))    // "10h"
```

### Time Format Written-Out

```js
ms(60000, { long: true })             // "1 minute"
ms(2 * 60000, { long: true })         // "2 minutes"
ms(-3 * 60000, { long: true })        // "-3 minutes"
ms(ms('10 hours'), { long: true })    // "10 hours"
```

## Features

- Works both in [Node.js](https://nodejs.org) and in the browser
- If a number is supplied to `ms`, a string with a unit is returned
- If a string that contains the number is supplied, it returns it as a number (e.g.: it returns `100` for `'100'`)
- If you pass a string with a number and a valid unit, the number of equivalent milliseconds is returned

## Related Packages

- [ms.macro](https://github.com/knpwrs/ms.macro) - Run `ms` as a macro at build-time.

## Caught a Bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Link the package to the global module directory: `npm link`
3. Within the module you want to test your local development instance of ms, just link it to the dependencies: `npm link ms`. Instead of the default one from npm, Node.js will now use your clone of ms!

As always, you can run the tests using: `npm test`

## 关键语义说明（中文）

- **导出接口**：`ms(val, options?)`。`val` 为非空字符串时解析为毫秒数；为有限数字时按 `options.long` 格式化输出字符串；其它输入（空串、`undefined`、`null`、数组、对象、`NaN`、`±Infinity`）一律抛出 `Error`。
- **单位倍率**：`s = 1000`，`m = s * 60`，`h = m * 60`，`d = h * 24`，`w = d * 7`（一周 = 7 天），`y = d * 365.25`。
- **解析规则**：使用 `parseFloat` 捕获数值，支持小数与前导点（如 `'1.5h'` → 5400000、`'.5ms'` → 0.5、`'-.5h'` → -1800000）；单位大小写不敏感（正则带 `/i` 并 `toLowerCase`），短别名与长别名（`years/weeks/days/hours/minutes/seconds/milliseconds` 及 `yrs/hrs/mins/secs/msecs` 等）均可识别；无法解析时返回 `NaN`。
- **格式化规则**：默认短格式（`ms(1000)` → `'1s'`），`{ long: true }` 输出长格式（`ms(1000, { long: true })` → `'1 second'`）。阈值按 `d/h/m/s/ms` 递减判断，四舍五入；负号保留（`ms(-1000)` → `'-1s'`）。长格式复数仅在 `msAbs >= n * 1.5` 时加 `s`，即 1 单位保持单数（`'1 second'`），≥1.5 单位才复数（`'10 seconds'`）。

## 测试摘要（`npm test` 全绿）

使用 mocha + expect.js，共 **49 个用例全部通过**：

- `ms(string)`：短单位解析（含小数、前导点、大小写、负值、多空格、非法返回 NaN）
- `ms(long string)`：长单位解析（含小数与负值）
- `ms(number, { long: true })`：长格式输出与复数阈值
- `ms(number)`：短格式输出（默认）
- `ms(invalid inputs)`：空串、`undefined`、`null`、`[]`、`{}`、`NaN`、`±Infinity` 均抛错
