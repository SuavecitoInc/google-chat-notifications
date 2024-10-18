type FunctionTypeA = {
  n: string; // 'add-order-note-js'
  d: string; // '467cdf5f1b6767287917294319d6c954a93b966a77bd6ee7fe8df7791b0c172a'
  dn: string; // '/api/addOrderNote'
  g: string; // 'gatsby-adapter-netlify@1.1.6'
  bd: [Object];
  id: string; // '2187736c1292b611976ab135b7cc194f2d5490ed26c97d5806347f30d750323b'
  s: number; // 1178102
  r: string; // 'nodejs20.x'
  c: string; // '2024-09-12T23:54:23.253Z'
  a: string; // '468299678394'
  oid: string; // 'ece322b5f5ad85b32bcb7db05f3f2ea5ca98b32743d4513d269b6f37fdb6e247'
};

type FunctionTypeB = {
  n: string; // 'ssr-engine'
  d: string; // '22ea2cae085899bcb43ea555877f57b6e9d210d2529e1a482f30db07ef64d604'
  dn: string; // 'SSR'
  g: string; // 'gatsby-adapter-netlify@1.1.6'
  bd: [Object];
  id: string; // 'c9d808d5d5ca692b7bceabb3e047f70311ea61e531621e8e505f80fc3348309f'
  a: string; // '335368946494'
  c: string; // '2024-09-24T23:19:18.012Z'
  m: number; // 1024
  obl: string;
  oblv: number; // 0
  oid: string; // 'a3250c1db4919dcd3ce81267ae40e82b5c9959281c672c3ea85bfa76ec8f794c'
  r: string; // 'nodejs20.x'
  rg: string; // 'us-east-1'
  s: number; // 41353851
};

type FunctionType = FunctionTypeA | FunctionTypeB;

export type NetlifyPayload = {
  id: string;
  site_id: string;
  build_id: string;
  state: string; // 'building' | 'error' | 'ready'
  name: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  deploy_url: string;
  deploy_ssl_url: string;
  created_at: string; // '2024-09-24T23:13:43.120Z';
  updated_at: string; // '2024-09-24T23:13:55.049Z';
  user_id: string;
  error_message: null | string;
  required: [];
  required_functions: null;
  commit_ref: null;
  review_id: null;
  branch: string;
  commit_url: null;
  skipped: null;
  locked: null;
  title: null;
  commit_message: null;
  review_url: null;
  published_at: null;
  context: string;
  deploy_time: null;
  available_functions: FunctionType[];
  screenshot_url: null;
  committer: null;
  skipped_log: null;
  manual_deploy: false;
  plugin_state: string; // 'none'
  lighthouse_plugin_scores: null;
  links: {
    permalink: string; // 'https://66f347a73305786dd1646c98--production-tres-noir.netlify.app'
    alias: string;
    branch: string | null;
  };
  framework: null;
  entry_path: null;
  views_count: null;
  function_schedules: [];
  public_repo: true;
  pending_review_reason: null;
  lighthouse: null;
  edge_functions_present: null;
  expires_at: null;
  blobs_region: string; // 'us-east-1'
};
