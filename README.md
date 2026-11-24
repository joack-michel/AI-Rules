# AI 分流规则

将 **OpenAI、Gemini、Claude / Anthropic** 合并为一套规则，分别提供 Quantumult X、Shadowrocket 和 Clash / Mihomo 格式。

## 订阅地址

| 客户端 | 文件 | 订阅地址 |
|---|---|---|
| Quantumult X | `rules/QuantumultX/AI.list` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/QuantumultX/AI.list` |
| Shadowrocket | `rules/Shadowrocket/AI.list` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Shadowrocket/AI.list` |
| Clash / Mihomo | `rules/Clash/AI_Classical.yaml` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Clash/AI_Classical.yaml` |

<!-- RULE-COUNTS:START -->
| 版本 | OpenAI | Gemini | Claude / Anthropic | 总计 |
|---|---:|---:|---:|---:|
| AI | 47 | 17 | 5 | 69 |
<!-- RULE-COUNTS:END -->

## Quantumult X

规则内置策略名为 `AI`。请先确保配置中存在名为 `AI` 的策略组，或使用 `force-policy` 覆盖。

在 `[filter_remote]` 中加入：

```ini
https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/QuantumultX/AI.list, tag=AI, force-policy=AI, enabled=true
```

若你的策略组叫 `PROXY`，把 `force-policy=AI` 改为 `force-policy=PROXY`。

## Shadowrocket

在远程规则或规则集界面添加：

```text
https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Shadowrocket/AI.list
```

导入时将该规则集绑定到 AI 专用策略组或代理策略组。文件本身不写死策略名。

## Clash / Mihomo

这是 `classical` 类型的 rule-provider：

```yaml
rule-providers:
  ai:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Clash/AI_Classical.yaml
    path: ./ruleset/AI_Classical.yaml
    interval: 86400

rules:
  - RULE-SET,ai,AI
```

配置中需要存在名为 `AI` 的代理组，也可以把最后一个 `AI` 改成已有策略组名称。

## Claude 补充范围

除上游 Claude 规则中的 `anthropic.com` 和 `claude.ai` 外，本仓库额外加入：

- `claude.com`
- `claudeusercontent.com`

## 规则维护

三个订阅地址保持不变，保留历史规则，并补充官方文档中的登录、验证码与 Gemini 服务主机。官方防火墙允许列表不等同于专用代理分流列表；第三方共享域名仍可能匹配非 AI 流量。

为兼容历史登录、支付及语音场景，暂保留共享服务后缀、AS20473 和历史 IP 规则；因此部分非 AI 流量可能命中 AI 策略组。保留 `usercontent.goog`。

OpenAI 官方语音 IP 清单： https://openai.com/chatgpt-voice.json 。本次未能验证其内容，暂不自动覆盖历史 IP；未进行客户端实测。UDP 3478 支持及 WebSocket TCP 443 通行仍需客户端和代理链支持。

规则唯一数据源：`data/rules.json`。修改源文件及 updated 日期后，运行：

```sh
node scripts/generate.mjs
node scripts/generate.mjs --check
```

生成器会同步三份订阅文件及本 README 的规则数量，并检查重复、基本格式及 IP 语法。不要直接修改生成的订阅文件。

官方参考：
- [OpenAI 网络要求](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)
- [Gemini 防火墙设置](https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/gemini-app-firewall-settings)

## 来源与许可

主要规则整理自：

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
- [ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)（用于核对新增 Claude 域名）

规则文件属于对上游 GPL-2.0 内容的整理和修改，继续按 **GNU GPL v2.0** 分发。修改日期：2026-11-24。
