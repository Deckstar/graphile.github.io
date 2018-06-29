webpackJsonp([99411096849217],{399:function(e,s){e.exports={data:{remark:{html:'<h2 id="computed-columns"><a href="#computed-columns" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Computed Columns</h2>\n<p>Not all the data returned from PostGraphile has to be concrete data in your\ndatabase, we also support computing data on the fly. An example of this is our\n"computed columns" feature where you can add what appears to be an extra column\n(field) to the GraphQL type that represents your table which is actually\ncalculated by calling a function. We inline this function call into the\noriginal select statement, so there\'s no N+1 issues with this - it\'s very\nefficient.</p>\n<p>You can create PostgreSQL functions that match the following criteria to add a\nfield to a table type. This field could be simple (such as <code class="language-text">name</code> constructed\nfrom <code class="language-text">first_name || &#39; &#39; || last_name</code>) or could return a composite type (e.g.\ndatabase row) or even a whole connection. For this to work, the following rules\napply to the function you create:</p>\n<ul>\n<li>name must begin with the name of the table it applies to, followed by an underscore (<code class="language-text">_</code>)</li>\n<li>first argument must be the table type</li>\n<li>must return a named type - we do not currently support anonymous types</li>\n<li>must NOT return <code class="language-text">VOID</code></li>\n<li>must be marked as <code class="language-text">STABLE</code></li>\n<li>must be defined in the same schema as the table</li>\n</ul>\n<h3 id="example"><a href="#example" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Example</h3>\n<p>This example creates two computed columns, one returning a simple varchar and\nthe other a connection. Note that these methods could also accept additional\narguments which would also automatically be added to the generated GraphQL\nfield:</p>\n<div class="gatsby-highlight">\n      <pre class="language-sql"><code class="language-sql"><span class="token keyword">create</span> <span class="token keyword">table</span> my_schema<span class="token punctuation">.</span>users <span class="token punctuation">(</span>\n  id <span class="token keyword">serial</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">primary</span> <span class="token keyword">key</span><span class="token punctuation">,</span>\n  first_name <span class="token keyword">varchar</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>\n  last_name <span class="token keyword">varchar</span> <span class="token operator">not</span> <span class="token boolean">null</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">create</span> <span class="token keyword">table</span> my_schema<span class="token punctuation">.</span>friendships <span class="token punctuation">(</span>\n  user_id <span class="token keyword">integer</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>\n  target_id <span class="token keyword">integer</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>\n  <span class="token keyword">primary</span> <span class="token keyword">key</span> <span class="token punctuation">(</span>user_id<span class="token punctuation">,</span> target_id<span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">create</span> <span class="token keyword">function</span> my_schema<span class="token punctuation">.</span>users_name<span class="token punctuation">(</span>u my_schema<span class="token punctuation">.</span>users<span class="token punctuation">)</span>\n<span class="token keyword">returns</span> <span class="token keyword">varchar</span> <span class="token keyword">as</span> $$\n  <span class="token keyword">select</span> u<span class="token punctuation">.</span>first_name <span class="token operator">||</span> <span class="token string">\' \'</span> <span class="token operator">||</span> u<span class="token punctuation">.</span>last_name<span class="token punctuation">;</span>\n$$ <span class="token keyword">language</span> <span class="token keyword">sql</span> stable<span class="token punctuation">;</span>\n\n<span class="token keyword">create</span> <span class="token keyword">function</span> my_schema<span class="token punctuation">.</span>users_friends<span class="token punctuation">(</span>u my_schema<span class="token punctuation">.</span>users<span class="token punctuation">)</span>\n<span class="token keyword">returns</span> setof my_schema<span class="token punctuation">.</span>users <span class="token keyword">as</span> $$\n  <span class="token keyword">select</span> users<span class="token punctuation">.</span><span class="token operator">*</span>\n  <span class="token keyword">from</span> my_schema<span class="token punctuation">.</span>users\n  <span class="token keyword">inner</span> <span class="token keyword">join</span> my_schema<span class="token punctuation">.</span>friendships\n  <span class="token keyword">on</span> <span class="token punctuation">(</span>friendships<span class="token punctuation">.</span>target_id <span class="token operator">=</span> users<span class="token punctuation">.</span>id<span class="token punctuation">)</span>\n  <span class="token keyword">where</span> friendships<span class="token punctuation">.</span>user_id <span class="token operator">=</span> u<span class="token punctuation">.</span>id<span class="token punctuation">;</span>\n$$ <span class="token keyword">language</span> <span class="token keyword">sql</span> stable<span class="token punctuation">;</span></code></pre>\n      </div>',frontmatter:{path:"/postgraphile/computed-columns/",title:"Computed Columns"}},nav:{edges:[{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [0] >>> JSON",name:"graphile-build",sections:[{id:"guides",title:"Overview"},{id:"library-reference",title:"Using the Library"},{id:"plugin-reference",title:"Building a Plugin"}],pages:[{to:"/graphile-build/getting-started/",title:"Getting Started",sectionId:"guides"},{to:"/graphile-build/plugins/",title:"Plugins",sectionId:"guides"},{to:"/graphile-build/hooks/",title:"Hooks",sectionId:"guides"},{to:"/graphile-build/look-ahead/",title:"Look Ahead",sectionId:"guides"},{to:"/graphile-build/graphile-build/",title:"graphile-build",sectionId:"library-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"library-reference"},{to:"/graphile-build/plugin-options/",title:"Options",sectionId:"library-reference"},{to:"/graphile-build/default-plugins/",title:"Default Plugins",sectionId:"library-reference"},{to:"/graphile-build/omitting-plugins/",title:"Omitting Plugins",sectionId:"guides"},{to:"/graphile-build/all-hooks/",title:"All Hooks",sectionId:"plugin-reference"},{to:"/graphile-build/build-object/",title:"Build Object",sectionId:"plugin-reference"},{to:"/graphile-build/context-object/",title:"Context Object",sectionId:"plugin-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"plugin-reference"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [1] >>> JSON",name:"postgraphile",sections:[{id:"overview",title:"Overview"},{id:"guides",title:"Guides"},{id:"usage",title:"Usage"}],pages:[{to:"/postgraphile/introduction/",title:"Introduction",sectionId:"overview"},{to:"/postgraphile/quick-start-guide/",title:"Quick Start Guide",sectionId:"overview"},{to:"/postgraphile/evaluating/",title:"Evaluating for your Project",sectionId:"guides"},{to:"/postgraphile/requirements/",title:"Requirements",sectionId:"overview"},{to:"/postgraphile/performance/",title:"Performance",sectionId:"overview"},{to:"/postgraphile/connections/",title:"Connections",sectionId:"overview"},{to:"/postgraphile/filtering/",title:"Filtering",sectionId:"overview"},{to:"/postgraphile/relations/",title:"Relations",sectionId:"overview"},{to:"/postgraphile/crud-mutations/",title:"CRUD Mutations",sectionId:"overview"},{to:"/postgraphile/computed-columns/",title:"Computed Columns",sectionId:"overview"},{to:"/postgraphile/custom-queries/",title:"Custom Queries",sectionId:"overview"},{to:"/postgraphile/custom-mutations/",title:"Custom Mutations",sectionId:"overview"},{to:"/postgraphile/smart-comments/",title:"Smart Comments",sectionId:"overview"},{to:"/postgraphile/security/",title:"Security",sectionId:"overview"},{to:"/postgraphile/introspection/",title:"Introspection",sectionId:"overview"},{to:"/postgraphile/extending/",title:"Schema Plugins",sectionId:"overview"},{to:"/postgraphile/plugins/",title:"Server Plugins",sectionId:"overview"},{to:"/postgraphile/subscriptions/",title:"Subscriptions",sectionId:"overview"},{to:"/postgraphile/production/",title:"Production Considerations",sectionId:"overview"},{to:"/postgraphile/reserved-keywords/",title:"Reserved Keywords",sectionId:"overview"},{to:"/postgraphile/debugging/",title:"Debugging",sectionId:"overview"},{to:"/postgraphile/jwt-guide/",title:"PostGraphile JWT Guide",sectionId:"guides"},{to:"/postgraphile/default-role/",title:"The Default Role",sectionId:"guides"},{to:"/postgraphile/procedures/",title:"PostgreSQL Procedures",sectionId:"guides"},{to:"/postgraphile/postgresql-schema-design/",title:"PostgreSQL Schema Design",sectionId:"guides"},{to:"/postgraphile/postgresql-indexes/",title:"PostgreSQL Indexes",sectionId:"guides"},{to:"/postgraphile/v4-new-features/",title:"v4 Feature Guide",sectionId:"guides"},{to:"/postgraphile/v3-migration/",title:"v3 → v4 Migration Guide",sectionId:"guides"},{to:"/postgraphile/usage-cli/",title:"CLI Usage",sectionId:"usage"},{to:"/postgraphile/usage-library/",title:"Library Usage",sectionId:"usage"},{to:"/postgraphile/usage-schema/",title:"Schema-only Usage",sectionId:"usage"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [2] >>> JSON",name:"graphile-build-pg",sections:[{id:"usage",title:"Usage"}],pages:[{to:"/postgraphile/settings/",title:"Settings",sectionId:"usage"}]}}]}},pathContext:{layout:"page"}}}});
//# sourceMappingURL=path---postgraphile-computed-columns-41d1e78d62e4b0aaad61.js.map