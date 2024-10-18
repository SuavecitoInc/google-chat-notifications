type Context = {
  name: string;
  type: string;
  version: string;
};

type Contexts = {
  browser: Context;
  os: Context;
};

type MechanismData = {
  message: string;
  mode: string;
  name: string;
};

type Mechanism = {
  data: MechanismData;
  description: any;
  handled: boolean;
  help_link: any;
  meta: any;
  synthetic: any;
  type: string;
};

type FrameData = {
  orig_in_app: number;
};

type Frame = {
  abs_path: string;
  colno: number;
  context_line?: string;
  data: FrameData;
  errors: any;
  filename: string;
  function: any;
  image_addr: any;
  in_app: boolean;
  instruction_addr: any;
  lineno: number;
  module?: string;
  package: any;
  platform: any;
  post_context: any;
  pre_context: any;
  raw_function: any;
  symbol: any;
  symbol_addr: any;
  trust: any;
  vars: any;
};

type Stacktrace = {
  frames: Frame[];
};

type Value = {
  mechanism: Mechanism;
  stacktrace: Stacktrace;
  type: string;
  value: string;
};

type Exception = {
  values: Value[];
};

type GroupingConfig = {
  enhancements: string;
  id: string;
};

type Metadata = {
  filename: string;
  type: string;
  value: string;
};

type Request = {
  cookies: any;
  data: any;
  env: any;
  fragment: any;
  headers: string[][];
  inferred_content_type: any;
  method: any;
  query_string: any[];
  url: string;
};

type Package = {
  name: string;
  version: string;
};

type Sdk = {
  integrations: string[];
  name: string;
  packages: Package[];
  version: string;
};

type User = {
  ip_address: string;
};

type Setting = {
  name: string;
  value: string;
};

type IssueAlert = {
  title: string;
  settings: Setting[];
};

type Installation = {
  uuid: string;
};

type Actor = {
  id: string;
  name: string;
  type: string;
};

type Event = {
  _ref: number;
  _ref_version: number;
  contexts: Contexts;
  culprit: string;
  datetime: string;
  dist: any;
  event_id: string;
  exception: Exception;
  fingerprint: string[];
  grouping_config: GroupingConfig;
  hashes: string[];
  issue_url: string;
  issue_id: string;
  key_id: string;
  level: string;
  location: string;
  logger: string;
  message: string;
  metadata: Metadata;
  platform: string;
  project: number;
  received: number;
  release: any;
  request: Request;
  sdk: Sdk;
  tags: string[][];
  time_spent: any;
  timestamp: number;
  title: string;
  type: string;
  url: string;
  user: User;
  version: string;
  web_url: string;
};

type Data = {
  event: Event;
  triggered_rule: string;
  issue_alert: IssueAlert;
};

export type SentryIssuePaylod = {
  action: string;
  actor: Actor;
  data: Data;
  installation: Installation;
};
