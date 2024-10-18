export type UptimePayload = {
  heartbeat: {
    monitorID: number; // 29
    status: number; // 0
    time: string; // '2024-09-24 23:51:35.527';
    msg: string; // 'getaddrinfo ENOTFOUND test.com'
    important: boolean;
    duration: number; // 0
    timezone: string; // 'America/Los_Angeles'
    timezoneOffset: string; // '-07:00'
    localDateTime: string; // '2024-09-24 16:51:35'
  };
  monitor: {
    id: number; // 29
    name: string; // 'Test'
    description: string | null;
    pathName: string; // 'Test
    parent: string | null;
    childrenIDs: number[];
    url: string;
    method: string; // 'GET' | 'POST'
    hostname: string | null;
    port: number | null;
    maxretries: number; // 0
    weight: number; // 2000
    active: boolean;
    forceInactive: boolean;
    type: string; // 'http'
    timeout: number; // 48
    interval: number; // 60
    retryInterval: number; // 60
    resendInterval: number; // 0
    keyword: string | null;
    invertKeyword: boolean;
    expiryNotification: boolean;
    ignoreTls: boolean;
    upsideDown: boolean;
    packetSize: number; // 56
    maxredirects: number; // 10
    accepted_statuscodes: string[]; // '200-299'
    dns_resolve_type: string; // 'A
    dns_resolve_server: string; // '1.1.1.1'
    dns_last_result: string | null;
    docker_container: string;
    docker_host: string | null;
    proxyId: number | null;
    notificationIDList: { [key: string]: boolean }; // {'2': true}
    tags: string[];
    maintenance: boolean;
    mqttTopic: string;
    mqttSuccessMessage: string;
    databaseQuery: string | null;
    authMethod: string | null;
    grpcUrl: string | null;
    grpcProtobuf: string | null;
    grpcMethod: string | null;
    grpcServiceName: string | null;
    grpcEnableTls: boolean;
    radiusCalledStationId: string | null;
    radiusCallingStationId: string | null;
    game: null;
    gamedigGivenPortOnly: boolean;
    httpBodyEncoding: string; // 'json'
    jsonPath: string | null;
    expectedValue: string | null;
    kafkaProducerTopic: string | null;
    kafkaProducerBrokers: string[];
    kafkaProducerSsl: boolean;
    kafkaProducerAllowAutoTopicCreation: boolean;
    kafkaProducerMessage: null;
    screenshot: null;
    includeSensitiveData: boolean;
  };
  msg: string; // '[Test] [🔴 Down] getaddrinfo ENOTFOUND test.com'
};
