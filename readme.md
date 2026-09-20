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

## 中文说明（关键语义）

本包零运行时依赖，仅导出一个函数 `ms(val, options?)`：

- **字符串输入（非空）**：解析为毫秒数。支持短别名 `y/w/d/h/m/s/ms` 与长别名 `years/weeks/days/hours/minutes/seconds/milliseconds` 以及 `yrs/hrs/mins/secs/msecs` 等；单位大小写不敏感（如 `'1.5H'` 等价于 `'1.5h'`）。
- **单位倍率**：`s=1000`，`m=s*60`，`h=m*60`，`d=h*24`，`w=d*7`（一周严格等于 7 天），`y=d*365.25`。
- **数值解析**：使用 `parseFloat`，支持小数与前导点，如 `ms('1.5h')===5400000`、`ms('.5ms')===0.5`、`ms('-.5h')===-1800000`；负号保留。
- **数字输入（有限数）**：默认输出短格式（`ms(1000)==='1s'`）；传 `{ long: true }` 输出长格式（`ms(1000,{long:true})==='1 second'`）。
- **复数阈值**：仅当绝对值 `>= 1.5` 个单位时才加 `s`，因此 `1` 单位始终为单数（`'1 second'`），`1.5` 及以上才为复数（`'2 seconds'`、`'10 seconds'`）。
- **负数格式化**：短/长格式都保留负号，如 `ms(-500)==='-500ms'`、`ms(-1000,{long:true})==='-1 second'`。
- **四舍五入**：格式化结果使用 `Math.round`，如 `ms(234234234)==='3d'`。
- **非法输入**：空字符串、`undefined`、`null`、数组、对象、`NaN`、`±Infinity` 一律抛出 `Error`；格式错误的非空字符串（如 `'☃'`）返回 `NaN`。

## 测试

`npm test`（mocha + expect.js，无运行时依赖）实测全绿摘要：

| 用例组 | 通过数 |
| --- | ---: |
| `ms(string)` | 16 |
| `ms(long string)` | 11 |
| `ms(number, { long: true })` | 7 |
| `ms(number)` | 7 |
| `ms(invalid inputs)` | 8 |
| `ms(regressions)` | 8 |
| **合计** | **57 passing，0 failing** |
