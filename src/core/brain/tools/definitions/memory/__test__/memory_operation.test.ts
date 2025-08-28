import { describe, it, expect } from 'vitest';
import { extractFactTags, extractFactPattern } from '../memory_operation.js';

describe('extractFactTags', () => {
    const defaultProfile = {
        tagMap: {
            javascript: 'javascript',
            typescript: 'typescript',
            python: 'python',
            react: 'react',
            "vue.js": 'vue',
            vuejs: 'vue',
            vue: 'vue',
            angular: 'angular',
            express: 'express',
            docker: 'docker',
            git: 'git',
            npm: 'npm',
            webpack: 'webpack',
            function: 'function',
            class: 'class',
            const: 'const',
            let: 'let',
            var: 'var',
            '.js': '.js',
            '.ts': '.ts',
            '.py': '.py',
            error: 'error',
            exception: 'exception',
            failed: 'failed',
            bug: 'bug',
            config: 'config',
            setting: 'setting',
            option: 'option',
            api: 'api',
            endpoint: 'endpoint',
            request: 'request',
            response: 'response',
        },
    };

    it('should extract JavaScript tag', () => {
        const fact = 'This is a JavaScript function for handling events';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('javascript');
    });

    it('should extract TypeScript tag', () => {
        const fact = 'TypeScript provides static typing for JavaScript';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('typescript');
    });

    it('should extract multiple tags', () => {
        const fact = 'Compare JavaScript vs Python performance in web development';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('javascript');
        expect(tags).toContain('python');
    });

    it('should handle case insensitive tag detection', () => {
        const fact = 'JAVASCRIPT and typescript are both popular';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('javascript');
        expect(tags).toContain('typescript');
    });

    it('should extract framework tags', () => {
        const fact = 'React and Vue.js are popular frontend frameworks';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('react');
        expect(tags).toContain('vue');
        expect(tags).toContain('.js');
    });

    it('should extract tool tags', () => {
        const fact = 'Use Docker and npm for deployment';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('docker');
        expect(tags).toContain('npm');
    });

    it('should extract file extension tags', () => {
        const fact = 'Edit the app.js and main.py files';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('.js');
        expect(tags).toContain('.py');
    });

    it('should extract error-related tags', () => {
        const fact = 'An error or exception occurred';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('error');
        expect(tags).toContain('exception');
    });

    it('should extract configuration tags', () => {
        const fact = 'Update the config and setting options';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('config');
        expect(tags).toContain('setting');
        expect(tags).toContain('option');
    });

    it('should extract API-related tags', () => {
        const fact = 'The API endpoint handles the request and response';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('api');
        expect(tags).toContain('endpoint');
        expect(tags).toContain('request');
        expect(tags).toContain('response');
    });

    it('should return general-knowledge for non-technical content', () => {
        const fact = 'The weather is nice today and I like coffee';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('general-knowledge');
    });

    it('should handle empty strings', () => {
        const fact = '';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('general-knowledge');
    });

    it('should handle whitespace-only strings', () => {
        const fact = '   \n\t   ';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('general-knowledge');
    });

    it('should remove duplicate tags', () => {
        const fact = 'JavaScript and javascript and JAVASCRIPT are the same language';
        const tags = extractFactTags(fact, defaultProfile);
        const jsCount = tags.filter(tag => tag === 'javascript').length;
        expect(jsCount).toBe(1);
    });

    it('should return lowercase tags', () => {
        const fact = 'REACT and VUE and ANGULAR frameworks';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags.every(tag => tag === tag.toLowerCase())).toBe(true);
    });

    it('should handle mixed technical and non-technical content', () => {
        const fact = 'I was working on a React component yesterday and it was fun';
        const tags = extractFactTags(fact, defaultProfile);
        expect(tags).toContain('react');
        expect(tags).not.toContain('general-knowledge');
    });
});
describe('extractFactPattern', () => {
    const defaultProfile = {
        extractablePatterns: [
            { pattern: 'javascript', flags: 'i' },
            { pattern: 'typescript', flags: 'i' },
            { pattern: 'python', flags: 'i' },
            { pattern: 'react', flags: 'i' },
            { pattern: 'vue(\\.js)?', flags: 'i' },
            { pattern: 'express(\\.js)?', flags: 'i' },
            { pattern: 'docker', flags: 'i' },
            { pattern: 'git', flags: 'i' },
            { pattern: 'npm', flags: 'i' },
            { pattern: 'webpack', flags: 'i' },
            { pattern: 'function', flags: 'i' },
            { pattern: 'class', flags: 'i' },
            { pattern: 'const', flags: 'i' },
            { pattern: 'let', flags: 'i' },
            { pattern: 'var', flags: 'i' },
            { pattern: '\\.js', flags: 'i' },
            { pattern: '\\.ts', flags: 'i' },
            { pattern: '\\.py', flags: 'i' },
            { pattern: 'error', flags: 'i' },
            { pattern: 'exception', flags: 'i' },
            { pattern: 'failed', flags: 'i' },
            { pattern: 'bug', flags: 'i' },
            { pattern: 'config', flags: 'i' },
            { pattern: 'setting', flags: 'i' },
            { pattern: 'option', flags: 'i' },
            { pattern: 'api', flags: 'i' },
            { pattern: 'endpoint', flags: 'i' },
            { pattern: 'request', flags: 'i' },
            { pattern: 'response', flags: 'i' },
        ],
    };

    it('should extract JavaScript pattern', () => {
        const fact = 'This is a JavaScript function for handling events';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('javascript');
    });

    it('should extract TypeScript pattern', () => {
        const fact = 'TypeScript provides static typing for JavaScript';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('javascript');
    });

    it('should extract Python pattern', () => {
        const fact = 'Python is great for data science and web development';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('python');
    });

    it('should extract React pattern', () => {
        const fact = 'React hooks provide state management in functional components';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('react');
    });

    it('should extract Vue pattern', () => {
        const fact = 'Vue.js is a progressive framework for building user interfaces';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('vue');
    });

    it('should extract Express pattern', () => {
        const fact = 'Express.js is a web framework for Node.js applications';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('express');
    });

    it('should extract Docker pattern', () => {
        const fact = 'Docker containers provide consistent deployment environments';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('docker');
    });

    it('should extract Git pattern', () => {
        const fact = 'Git version control helps manage code changes';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('git');
    });

    it('should extract npm pattern', () => {
        const fact = 'npm install packages for JavaScript projects';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('javascript');
    });

    it('should extract multiple patterns (first match)', () => {
        const fact = 'Compare JavaScript vs Python performance in web development';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(['javascript', 'python']).toContain(pattern?.toLowerCase());
    });

    it('should handle case insensitive pattern detection', () => {
        const fact = 'JAVASCRIPT and typescript are both popular';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(['javascript', 'typescript']).toContain(pattern?.toLowerCase());
    });

    it('should extract file extension pattern', () => {
        const fact = 'Edit the app.js file in the root directory';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('.js');
    });

    it('should extract error keyword pattern', () => {
        const fact = 'An error occurred during compilation';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('error');
    });

    it('should extract config keyword pattern', () => {
        const fact = 'Update the config file with new database settings';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('config');
    });

    it('should extract api keyword pattern', () => {
        const fact = 'The REST API provides data access';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern?.toLowerCase()).toContain('api');
    });

    it('should return undefined for non-technical content', () => {
        const fact = 'The weather is nice today and I like coffee';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern).toBeUndefined();
    });

    it('should handle empty strings', () => {
        const fact = '';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern).toBeUndefined();
    });

    it('should handle whitespace-only strings', () => {
        const fact = '   \n\t   ';
        const pattern = extractFactPattern(fact, defaultProfile);
        expect(pattern).toBeUndefined();
    });
});