import { ServerConfigsSchema } from '../../mcp/config.js';
import { LLMConfigSchema } from '../llm/config.js';
import { EmbeddingConfigSchema } from '../embedding/config.js';
import { z } from 'zod';
export const AgentCardSchema = z
	.object({
		name: z.string().default('cipher'),
		description: z
			.string()
			.default(
				'cipher is an AI assistant capable of store valuable software development knowledge for your vibe coding agents'
			),
		provider: z
			.object({
				organization: z.string().default('byterover-inc'),
				url: z.string().url().default('https://byterover.dev'),
			})
			.optional(),
		version: z.string().default('1.0.0'),
		defaultInputModes: z.array(z.string()).default(['application/json', 'text/plain']),
		defaultOutputModes: z
			.array(z.string())
			.default(['application/json', 'text/event-stream', 'text/plain']),
		skills: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
					description: z.string(),
					tags: z.array(z.string()),
					examples: z.array(z.string()).optional(),
					inputModes: z.array(z.string()).optional().default(['text/plain']),
					outputModes: z.array(z.string()).optional().default(['text/plain']),
				})
			)
			.default([
				{
					id: 'chat_with_agent',
					name: 'chat_with_agent',
					description: 'Allows you to chat with an AI agent. Send a message to interact.',
					tags: ['chat', 'AI', 'assistant', 'mcp', 'natural language'],
					examples: [
						`Send a JSON-RPC request to /mcp with method: "chat_with_agent" and params: {"message":"Your query..."}`,
						'Alternatively, use a compatible MCP client library.',
					],
				},
			]),
	})
	.strict();
export const EventPersistenceConfigSchema = z.object({
	enabled: z.boolean().default(true),
	storageType: z.enum(['file', 'memory', 'database']).default('file'),
	maxEvents: z.number().optional(),
	rotationSize: z.number().optional(),
	retentionDays: z.number().optional(),
	filePath: z.string().optional(),
});
export const MemoryProfileSchema = z.object({
	name: z.string(),
	description: z.string(),
	prompts: z.object({
		system: z.string()
	}),
	tools: z.record(
		z.object({
			description: z.string(),
			parameters: z.record(z.any()),
		})
	),
	skipPatterns: z.array(z.object({
		pattern: z.string(),
		flags: z.string(),
	})),
	keyPatterns: z.array(z.object({
		pattern: z.string(),
		flags: z.string().optional(),
	})),
	commonPatterns: z.array(z.object({
		pattern: z.string(),
		flags: z.string().optional(),
	})),
	wordPatterns: z.array(z.string()),
	domainTags: z.record(z.string()),
});
export const AgentConfigSchema = z
	.object({
		agentCard: AgentCardSchema.describe('Configuration for the agent card').optional(),
		systemPrompt: z
			.string()
			.describe(
				'The system prompt content as a string, or a structured system prompt configuration'
			),
		mcpServers: ServerConfigsSchema.default({}).describe(
			'Configurations for MCP (Model Context Protocol) servers used by the agent'
		),
		llm: LLMConfigSchema.describe('Core LLM configuration for the agent'),
		evalLlm: LLMConfigSchema.optional().describe(
			'Evaluation LLM configuration for non-thinking tasks (optional, falls back to main LLM if not provided)'
		),
		embedding: z
			.union([EmbeddingConfigSchema, z.object({ disabled: z.boolean() }), z.boolean(), z.null()])
			.optional()
			.describe(
				'Embedding configuration for the agent (optional, falls back to environment auto-detection if not provided). Set to false, null, or {disabled: true} to disable embeddings.'
			),
		sessions: z
			.object({
				maxSessions: z
					.number()
					.int()
					.positive()
					.default(100)
					.describe('Maximum number of concurrent sessions allowed, defaults to 100'),
				sessionTTL: z
					.number()
					.int()
					.positive()
					.default(3600000)
					.describe('Session time-to-live in milliseconds, defaults to 3600000ms (1 hour)'),
			})
			.default({
				maxSessions: 100,
				sessionTTL: 3600000,
			})
			.describe('Session management configuration'),
		eventPersistence: EventPersistenceConfigSchema.optional(),
		memoryProfile: MemoryProfileSchema.default({
			name: "default",
			description: "Default memory profile for general programming knowledge and decision retention.",
			prompts: {
				system: `You analyze programming knowledge facts and decide ADD, UPDATE, DELETE, or NONE using similarity with existing memories and context.

			Process only significant technical content (concepts, code details, patterns, implementations). Skip personal or trivial content.

			Consider:
			1) Technical relevance and value
			2) Semantic similarity/overlap
			3) Recency and contextual relevance
			4) Quality and completeness
			5) Conversation context and needs
			6) Concrete code/pattern details

			Rules:
			- ADD: New, unique technical knowledge
			- UPDATE: Improves/corrects existing technical knowledge
			- DELETE: Outdated/incorrect/contradictory information
			- NONE: Duplicate, already covered, or non-significant

			Always preserve full code blocks/commands/patterns exactly as given.`
			},
			tools: {
				extract_knowledge: {
					description: "Extract detailed knowledge with implementation code, commands, and technical details from the interaction.",
					parameters: {
					knowledge: "An array of strings, each containing a programming knowledge along with complete implementation code, command syntax, or technical details when present. Always preserve the complete pattern within triple backticks."
					}
				}
			},
			skipPatterns: [
				{ pattern: "\\b(my name|user['']?s? name|find my name|search.*name|who am i|what['']?s my name)\\b", flags: "i" },
				{ pattern: "\\b(personal|profile|identity|username|login|password|email|address|phone)\\b", flags: "i" },
				{ pattern: "^(user:|assistant:)?\\s*(search|find|look|what|where|who|when|why|how)\\s+(is|are|was|were|do|does|did|can|could|should|would|will|my|the|a|an)\\b", flags: "i" },
				{ pattern: "^(user:|assistant:)?\\s*(hello|hi|hey|good morning|good afternoon|good evening|thanks|thank you|please|sorry|excuse me|bye|goodbye)\\b", flags: "i" },
				{ pattern: "^(cipher_memory_search|memory_search):\\s*(found|completed|no results|error)", flags: "i" },
				{ pattern: "^(task completed|operation successful|processing|loading|waiting|done|finished|ready)\\b", flags: "i" },
				{ pattern: "^(user:|assistant:)?\\s*(yes|no|ok|okay|sure|fine|great|good|right|correct|wrong|true|false)\\s*[.!?]?\\s*$", flags: "i" }
			],
			keyPatterns: [
				{ pattern: "\\b(function|method|class|interface|module|library|framework|algorithm|data structure|design pattern)\\b", flags: "i" },
				{ pattern: "\\b(variable|constant|parameter|argument|return|async|await|promise|callback|closure|scope)\\b", flags: "i" },
				{ pattern: "\\b(loop|iteration|recursion|condition|exception|error handling|debugging|testing|optimization)\\b", flags: "i" },
				{ pattern: "\\b(import|export|require|include|package|dependency|api|endpoint|request|response)\\b", flags: "i" },
				{ pattern: "\\b(database|query|sql|nosql|schema|table|index|transaction|orm|migration)\\b", flags: "i" },
				{ pattern: "\\b(git|version control|commit|merge|branch|pull request|repository|deployment)\\b", flags: "i" },
				{ pattern: "\\b(implements?|extends?|inherits?|overrides?|polymorphism|encapsulation|abstraction)\\b", flags: "i" },
				{ pattern: "\\b(sort|search|filter|map|reduce|transform|parse|serialize|encrypt|decrypt)\\b", flags: "i" },
				{ pattern: "\\b(authentication|authorization|security|validation|sanitization|middleware)\\b", flags: "i" },
				{ pattern: "```[\\s\\S]*```" },
				{ pattern: "`[^`]+`" },
				{ pattern: "\\$[a-zA-Z_][a-zA-Z0-9_]*" },
				{ pattern: "\\b(npm|yarn|pip|composer|cargo|go get|mvn|gradle)\\b", flags: "i" },
				{ pattern: "\\b(file|directory|path|config|environment|server|client|host|port|url|http|https|ssl|tls)\\b", flags: "i" },
				{ pattern: "\\b(dockerfile|docker|container|kubernetes|cloud|aws|azure|gcp|ci/cd|pipeline)\\b", flags: "i" },
				{ pattern: "\\b(javascript|typescript|python|java|c\\+\\+|c#|rust|go|php|ruby|swift|kotlin|scala|r)\\b", flags: "i" },
				{ pattern: "\\b(react|vue|angular|node|express|django|flask|spring|rails|laravel|fastapi)\\b", flags: "i" },
				{ pattern: "\\b(html|css|scss|sass|less|bootstrap|tailwind|webpack|vite|rollup|babel|eslint)\\b", flags: "i" },
				{ pattern: "\\b(error|exception|traceback|stack trace|compilation|syntax error|runtime error|type error)\\b", flags: "i" },
				{ pattern: "\\b(solution|approach|implementation|technique|strategy|pattern|best practice|optimization)\\b", flags: "i" },
				{ pattern: "\\b(performance|scalability|maintainability|refactoring|code review|documentation)\\b", flags: "i" },
				{ pattern: "\\b(code|coding|program|programming|develop|development|software|hardware|tech|technical|digital|computer|computing|algorithm|logic|syntax|semantic|compile|runtime|execute|debug|test|deploy|implement|configure|setup|install|upgrade|migrate|scale|optimize|refactor)\\b", flags: "i" }
			],
			commonPatterns: [
				{ pattern: "[{}\\[\\]()]" },
				{ pattern: "[=><!&|]" },
				{ pattern: "[;:,]" },
				{ pattern: "\\w+\\.\\w+" },
				{ pattern: "\\w+\\(\\)" },
				{ pattern: "/\\*[\\s\\S]*?\\*/|//.*$", flags: "m" }
			],
			wordPatterns: [
				"api", "sdk", "cli", "gui", "ui", "ux", "ide", "editor", "compiler", "interpreter", "runtime", "virtual", "machine", "container", "image", "build", "deploy", "release", "version", "update", "patch", "bug", "feature", "enhancement", "issue", "ticket", "workflow", "process", "pipeline", "automation", "script", "batch", "cron", "job", "service", "microservice", "monolith", "architecture", "pattern", "design", "system", "network", "protocol", "tcp", "udp", "http", "https", "ssl", "tls", "dns", "cdn", "cache", "redis", "memcached", "session", "cookie", "token", "jwt", "oauth", "auth", "encrypt", "decrypt", "hash", "salt", "key", "certificate", "public", "private", "binary", "ascii", "unicode", "utf8", "base64", "hex", "decimal", "octal", "buffer"
			],
			domainTags: {
				javascript: "frontend",
				typescript: "frontend",
				react: "frontend",
				vue: "frontend",
				angular: "frontend",
				html: "frontend",
				css: "frontend",
				node: "backend",
				express: "backend",
				api: "backend",
				database: "backend",
				sql: "backend",
				docker: "devops",
				kubernetes: "devops",
				deployment: "devops",
				ci: "devops",
				cd: "devops",
				git: "version-control",
				github: "version-control",
				testing: "quality-assurance",
				debug: "quality-assurance"
			}
      	})
		.describe("Memory profile configuration")
	})
	.strict()
	.describe('Main configuration for an agent, including its LLM and server connections');
// Input type for user-facing API (pre-parsing) - makes fields with defaults optional
export type AgentConfig = z.input<typeof AgentConfigSchema>;
