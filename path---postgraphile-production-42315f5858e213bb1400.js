webpackJsonp([0x94c8136db646],{418:function(e,n){e.exports={data:{remark:{html:'<h2 id="production-considerations"><a href="#production-considerations" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Production Considerations</h2>\n<p>When you run PostGraphile in production you\'ll want to ensure that people\ncannot easily trigger denial of service (DOS) attacks against you. Due to the\nnature of GraphQL it\'s easy to construct a small query that could be very\nexpensive for the server to run, for example:</p>\n<div class="gatsby-highlight">\n      <pre class="language-graphql"><code class="language-graphql">allUsers <span class="token punctuation">{</span>\n  nodes <span class="token punctuation">{</span>\n    postsByAuthorId <span class="token punctuation">{</span>\n      nodes <span class="token punctuation">{</span>\n        commentsByPostId <span class="token punctuation">{</span>\n          userByAuthorId <span class="token punctuation">{</span>\n            postsByAuthorId <span class="token punctuation">{</span>\n              nodes <span class="token punctuation">{</span>\n                commentsByPostId <span class="token punctuation">{</span>\n                  userByAuthorId <span class="token punctuation">{</span>\n                    postsByAuthorId <span class="token punctuation">{</span>\n                      nodes <span class="token punctuation">{</span>\n                        commentsByPostId <span class="token punctuation">{</span>\n                          userByAuthorId <span class="token punctuation">{</span>\n                            id\n                          <span class="token punctuation">}</span>\n                        <span class="token punctuation">}</span>\n                      <span class="token punctuation">}</span>\n                    <span class="token punctuation">}</span>\n                  <span class="token punctuation">}</span>\n                <span class="token punctuation">}</span>\n              <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>There\'s lots of techniques for protecting your server from these kinds of\nqueries; a great introduction to this subject is <a href="https://dev-blog.apollodata.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b">this blog\npost</a>\nfrom Apollo.</p>\n<h3 id="simple-query-whitelist"><a href="#simple-query-whitelist" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Simple: Query Whitelist</h3>\n<p>If you do not intend to open your API up to third parties to run arbitrary\nqueries against then using persisted queries as a query whitelist to protect\nyour GraphQL endpoint is a good solution. This technique ensures that only the\nqueries you use in your own applications can be executed on the server (but you\ncan of course change the variables).</p>\n<p>This technique has a few caveats:</p>\n<ul>\n<li>Your API will only accept queries that you\'ve approved, so it\'s not suitable if you want third parties to run arbitrary queries</li>\n<li>You must be able to generate a unique ID from each query; e.g. a hash</li>\n<li>You must use "static GraphQL queries" - that is the queries must be known at build time of your application/webpage, and only the variables fed to those queries can change at run-time</li>\n<li>You must have a way of sharing these queries between the application and the server</li>\n<li>You must be careful not to use variables in dangerous places; for example don\'t write <code class="language-text">allUsers(first: $myVar)</code> as a malicious attacker could set <code class="language-text">$myVar</code> to 2147483647 in order to cause your server to process as much data as possible.</li>\n</ul>\n<p>PostGraphile currently doesn\'t have this functionality built in, but it\'s\nfairly easy to add it when using PostGraphile as an express middleware, a\nsimple implementation might look like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">const</span> postgraphile <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'postgraphile\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'express\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> bodyParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'body-parser\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">/**** BEGINNING OF CUSTOMIZATION ****/</span>\n<span class="gatsby-highlight-code-line"><span class="token keyword">const</span> persistedQueries <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./persistedQueries.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</span><span class="gatsby-highlight-code-line">\n</span><span class="gatsby-highlight-code-line">app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token string">\'/graphql\'</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">,</span> next<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n</span><span class="gatsby-highlight-code-line">  <span class="token comment">// TODO: validate req.body is of the right form</span>\n</span><span class="gatsby-highlight-code-line">  req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>query <span class="token operator">=</span>\n</span><span class="gatsby-highlight-code-line">    <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span>hasOwnProperty<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>persistedQueries<span class="token punctuation">,</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>id<span class="token punctuation">)</span>\n</span><span class="gatsby-highlight-code-line">      <span class="token operator">?</span> persistedQueries<span class="token punctuation">[</span>req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>id<span class="token punctuation">]</span>\n</span><span class="gatsby-highlight-code-line">      <span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n</span><span class="gatsby-highlight-code-line">  <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</span><span class="gatsby-highlight-code-line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</span><span class="token comment">/**** END OF CUSTOMIZATION *** */</span>\n\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">postgraphile</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>i.e. a simple middleware mounted before postgraphile that manipulates the request body.</p>\n<p>I personally use my forks of Apollo\'s <code class="language-text">persistgraphql</code> tools to help me manage\nthe persisted queries themselves:</p>\n<ul>\n<li><a href="https://github.com/benjie/persistgraphql">https://github.com/benjie/persistgraphql</a></li>\n<li><a href="https://github.com/benjie/persistgraphql-webpack-plugin">https://github.com/benjie/persistgraphql-webpack-plugin</a></li>\n</ul>\n<p>These forks generate hashes rather than numbers; which make the persisted\nqueries consistent across multiple builds and applications (website, mobile,\nbrowser plugin, ...).</p>\n<p><strong>NOTE</strong>: even if you\'re using persisted queries, it can be wise to implement\nthe advanced protections as it enables you to catch unnecessarily expensive\nqueries before you start facing performance bottlenecks down the line.</p>\n<h3 id="advanced"><a href="#advanced" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Advanced</h3>\n<p>Using a query whitelist puts the decision in the hands of your engineers\nwhether a particular query should be accepted or not. Sometimes this isn\'t\nenough - it could be that your engineers need guidance to help them avoid\ncommon pit-falls (e.g. forgetting to put limits on collections they query), or\nit could be that you wish arbitrary third parties to be able to send queries to\nyour API without the queries being pre-approved and without the risk of\nbringing your servers to their knees.</p>\n<p><strong>You are highly encouraged to purchase the <a href="/postgraphile/pricing/">Pro Plugin [PRO]</a>,\nwhich implements these protections in a deeply integrated and PostGraphile\noptimised way, and has the added benefit of helping sustain development and\nmaintenance on the project.</strong></p>\n<p>The rest of this article relates to Pro Plugin\'s approach to addressing these\nissues, though there are hints on how you might go about solving the issues for\nyourself. Many of these techniques can be implemented outside of PostGraphile,\nfor example in an express middleware or a nginx reverse proxy between\nPostGraphile and the client.</p>\n<h4 id="sending-queries-to-read-replicas"><a href="#sending-queries-to-read-replicas" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Sending queries to read replicas</h4>\n<p>Probably the most important thing regarding scalability is making sure that your\nmaster database doesn\'t bow under the pressure of all the clients talking to it.\nOne way to reduce this pressure is to offload read operations to read replicas.\nIn GraphQL it\'s easy to tell if a request will perform any writes or not: if\nit\'s a <code class="language-text">query</code> then it\'s read-only, if it\'s a <code class="language-text">mutation</code> then it may perform\nwrites.</p>\n<p>Using <code class="language-text">--read-only-connection &lt;string&gt;</code> [PRO] you may give PostGraphile a\nseparate connection string to use for queries, to compliment the connection\nstring passed via <code class="language-text">--connection</code> which will now be used only for mutations.</p>\n<p>(If you\'re using middleware, then you\'ll want to pass a read-only pool to the\n<code class="language-text">readReplicaPgPool</code>[PRO] option instead.)</p>\n<blockquote>\n<p>NOTE: We don\'t currently support the multi-host syntax for this connection\nstring, but you can use a PostgreSQL proxy such a PgPool or PgBouncer between\nPostGraphile and your database to enable connecting to multiple read\nreplicas.</p>\n</blockquote>\n<h4 id="pagination-caps"><a href="#pagination-caps" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Pagination caps</h4>\n<p>It\'s unlikely that you want users to request <code class="language-text">allUsers</code> and receive back\nliterally all of the users in the database. More likely you want users to use\ncursor-based pagination over this connection with <code class="language-text">first</code> / <code class="language-text">after</code>. The Pro\nPlugin introduces the <code class="language-text">--default-pagination-cap [int]</code> [PRO] option which\nenables you to enforce a pagination cap on all connections. Whatever number\nyou pass will be used as the pagination cap, but you can override it on a\ntable-by-table basis using <a href="/postgraphile/smart-comments/">smart comments</a> - in this case the <code class="language-text">@paginationCap</code>[PRO] smart comment.</p>\n<div class="gatsby-highlight">\n      <pre class="language-sql"><code class="language-sql"><span class="token keyword">comment</span> <span class="token keyword">on</span> <span class="token keyword">table</span> users <span class="token operator">is</span>\n  E<span class="token string">\'@paginationCap 20\\nSomeone who can log in.\'</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<h4 id="limiting-graphql-query-depth"><a href="#limiting-graphql-query-depth" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Limiting GraphQL query depth</h4>\n<p>Most GraphQL queries tend to be only a few levels deep, queries like the deep\none at the top of this article are generally not required. You may use\n<code class="language-text">--graphql-depth-limit [int]</code> [PRO] to limit the depth of any GraphQL queries\nthat hit PostGraphile - any deeper than this will be discarded during query\nvalidation.</p>\n<h4 id="experimental-graphql-cost-limit"><a href="#experimental-graphql-cost-limit" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>[EXPERIMENTAL] GraphQL cost limit</h4>\n<p>The most powerful way of preventing DOS is to limit the cost of GraphQL queries\nthat may be executed against your GraphQL server. The Pro Plugin contains a\nvery early implementation of this technique, but the costs are not very\naccurate yet. You may enable a cost limit with <code class="language-text">--graphql-cost-limit [int]</code>\n[PRO] and the calculated cost of any GraphQL queries will be made available on\n<code class="language-text">meta</code> field in the GraphQL payload.</p>\n<p>If your GraphQL query is seen to be too expensive, here\'s some techniques to\nbring the calculated cost down:</p>\n<ul>\n<li>If you\'ve not specified a limit (<code class="language-text">first</code>/<code class="language-text">last</code>) on a connection, we assume\nit will return 1000 results. If you\'re expecting fewer than this, specify the\nmaximum you\'d ever expect to receive.</li>\n<li>Cost is based on number of expected results (without looking at the\ndatabase!) so lower your limits on connections.</li>\n<li>Connections multiply the cost of their children by the number of results\nthey\'re expected to return, so lower the limits on connections.</li>\n<li>Nested fields multiply costs; so pulling a connection inside a connection\ninside a connection is going to be expensive - to address this, try placing\nlower <code class="language-text">first</code>/<code class="language-text">last</code> values on the connections or avoiding fetching nested\ndata until you need to display it (split into multiple requests / only\nrequest the data you need).</li>\n<li>Subscriptions are automatically seen as 10x as expensive as queries - try\nand minimise the amount of data your subscription requests.</li>\n<li>Procedure connections are treated as more expensive than table connections.</li>\n<li><code class="language-text">totalCount</code> on a table has a fair cost</li>\n<li><code class="language-text">totalCount</code> on a procedure has a higher cost</li>\n<li>Using <code class="language-text">pageInfo</code> adds significant cost to connections</li>\n<li>Computed columns are seen as fairly expensive - in future we may factor in\nPostgreSQL\'s <code class="language-text">COST</code> parameter when figuring this out.</li>\n</ul>\n<p>Keep in mind this is a <strong>very early</strong> implementation of cost analysis, there\'s\nmuch improvement to be made. Feel free to reach out with any bad costs/queries\nso we can improve it.</p>',frontmatter:{path:"/postgraphile/production/",title:"Production Considerations"}},nav:{edges:[{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [0] >>> JSON",name:"graphile-build",sections:[{id:"guides",title:"Overview"},{id:"library-reference",title:"Using the Library"},{id:"plugin-reference",title:"Building a Plugin"}],pages:[{to:"/graphile-build/getting-started/",title:"Getting Started",sectionId:"guides"},{to:"/graphile-build/plugins/",title:"Plugins",sectionId:"guides"},{to:"/graphile-build/hooks/",title:"Hooks",sectionId:"guides"},{to:"/graphile-build/look-ahead/",title:"Look Ahead",sectionId:"guides"},{to:"/graphile-build/graphile-build/",title:"graphile-build",sectionId:"library-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"library-reference"},{to:"/graphile-build/plugin-options/",title:"Options",sectionId:"library-reference"},{to:"/graphile-build/default-plugins/",title:"Default Plugins",sectionId:"library-reference"},{to:"/graphile-build/omitting-plugins/",title:"Omitting Plugins",sectionId:"guides"},{to:"/graphile-build/all-hooks/",title:"All Hooks",sectionId:"plugin-reference"},{to:"/graphile-build/build-object/",title:"Build Object",sectionId:"plugin-reference"},{to:"/graphile-build/context-object/",title:"Context Object",sectionId:"plugin-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"plugin-reference"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [1] >>> JSON",name:"postgraphile",sections:[{id:"overview",title:"Overview"},{id:"guides",title:"Guides"},{id:"usage",title:"Usage"}],pages:[{to:"/postgraphile/introduction/",title:"Introduction",sectionId:"overview"},{to:"/postgraphile/quick-start-guide/",title:"Quick Start Guide",sectionId:"overview"},{to:"/postgraphile/evaluating/",title:"Evaluating for your Project",sectionId:"guides"},{to:"/postgraphile/requirements/",title:"Requirements",sectionId:"overview"},{to:"/postgraphile/performance/",title:"Performance",sectionId:"overview"},{to:"/postgraphile/connections/",title:"Connections",sectionId:"overview"},{to:"/postgraphile/filtering/",title:"Filtering",sectionId:"overview"},{to:"/postgraphile/relations/",title:"Relations",sectionId:"overview"},{to:"/postgraphile/crud-mutations/",title:"CRUD Mutations",sectionId:"overview"},{to:"/postgraphile/computed-columns/",title:"Computed Columns",sectionId:"overview"},{to:"/postgraphile/custom-queries/",title:"Custom Queries",sectionId:"overview"},{to:"/postgraphile/custom-mutations/",title:"Custom Mutations",sectionId:"overview"},{to:"/postgraphile/smart-comments/",title:"Smart Comments",sectionId:"overview"},{to:"/postgraphile/security/",title:"Security",sectionId:"overview"},{to:"/postgraphile/introspection/",title:"Introspection",sectionId:"overview"},{to:"/postgraphile/extending/",title:"Schema Plugins",sectionId:"overview"},{to:"/postgraphile/plugins/",title:"Server Plugins",sectionId:"overview"},{to:"/postgraphile/subscriptions/",title:"Subscriptions",sectionId:"overview"},{to:"/postgraphile/production/",title:"Production Considerations",sectionId:"overview"},{to:"/postgraphile/reserved-keywords/",title:"Reserved Keywords",sectionId:"overview"},{to:"/postgraphile/debugging/",title:"Debugging",sectionId:"overview"},{to:"/postgraphile/jwt-guide/",title:"PostGraphile JWT Guide",sectionId:"guides"},{to:"/postgraphile/default-role/",title:"The Default Role",sectionId:"guides"},{to:"/postgraphile/procedures/",title:"PostgreSQL Procedures",sectionId:"guides"},{to:"/postgraphile/postgresql-schema-design/",title:"PostgreSQL Schema Design",sectionId:"guides"},{to:"/postgraphile/postgresql-indexes/",title:"PostgreSQL Indexes",sectionId:"guides"},{to:"/postgraphile/v4-new-features/",title:"v4 Feature Guide",sectionId:"guides"},{to:"/postgraphile/v3-migration/",title:"v3 → v4 Migration Guide",sectionId:"guides"},{to:"/postgraphile/usage-cli/",title:"CLI Usage",sectionId:"usage"},{to:"/postgraphile/usage-library/",title:"Library Usage",sectionId:"usage"},{to:"/postgraphile/usage-schema/",title:"Schema-only Usage",sectionId:"usage"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [2] >>> JSON",name:"graphile-build-pg",sections:[{id:"usage",title:"Usage"}],pages:[{to:"/postgraphile/settings/",title:"Settings",sectionId:"usage"}]}}]}},pathContext:{layout:"page"}}}});
//# sourceMappingURL=path---postgraphile-production-42315f5858e213bb1400.js.map