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
	name: z.string().default('default'),
	description: z.string().default('Default memory profile'),
	prompts: z.object({
		system: z.string().default(`You analyze programming knowledge facts and decide ADD, UPDATE, DELETE, or NONE using similarity with existing memories and context.

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
		)
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
		memoryProfile: z
			.object({
				assigned: z.string().optional().default('default'),
				profiles: z.array(
					z.object({
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
					})
				),
			})
			.optional(),
	})
	.strict()
	.describe('Main configuration for an agent, including its LLM and server connections');
// Input type for user-facing API (pre-parsing) - makes fields with defaults optional
export type AgentConfig = z.input<typeof AgentConfigSchema>;
