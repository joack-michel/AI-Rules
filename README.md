# AI 分流规则

将 **OpenAI、Gemini、Claude / Anthropic** 合并为一套规则，分别提供 Quantumult X、Shadowrocket 和 Clash / Mihomo 格式。

## 订阅地址

| 客户端 | 文件 | 原始订阅地址 |
|---|---|---|
| Quantumult X | `rules/QuantumultX/AI.list` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/QuantumultX/AI.list` |
| Shadowrocket | `rules/Shadowrocket/AI.list` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Shadowrocket/AI.list` |
| Clash / Mihomo | `rules/Clash/AI_Classical.yaml` | `https://raw.githubusercontent.com/joack-michel/AI-Rules/main/rules/Clash/AI_Classical.yaml` |

当前共 **53 条规则**：

- OpenAI：35 条
- Gemini：13 条
- Claude / Anthropic：5 条

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

## 兼容性说明

为了保持原有 OpenAI 分流行为，本仓库完整保留上游规则。上游 OpenAI 列表包含 `stripe.com`、`sentry.io`、`intercom.io` 等共享第三方服务，因此少量非 OpenAI 流量也可能命中 AI 策略组。

## 来源与许可

主要规则整理自：

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
- [ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)（用于核对新增 Claude 域名）

规则文件属于对上游 GPL-2.0 内容的整理和修改，继续按 **GNU GPL v2.0** 分发。修改日期：2026-07-12。
