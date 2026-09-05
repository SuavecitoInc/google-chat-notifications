# NetSuite Integration

Usage from a typed User Event script:

```typescript
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
import { EntryPoints } from 'N/types';
import * as record from 'N/record';
import * as runtime from 'N/runtime';
import { sendAlert } from './chatAlertClient';

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (context) => {
  // Only fire on creation, not edits/deletes
  if (context.type !== context.UserEventType.CREATE) {
    return;
  }

  const rec = context.newRecord;

  const companyName = rec.getValue({ fieldId: 'companyname' }) as string;
  const email = rec.getValue({ fieldId: 'email' }) as string;
  const leadSource = rec.getText({ fieldId: 'leadsource' }) as string;
  const salesRep = rec.getText({ fieldId: 'salesrep' }) as string;

  sendAlert({
    recordType: 'lead',
    recordId: rec.id as number,
    eventType: 'create',
    title: `New lead: ${companyName || 'Unnamed lead'}`,
    severity: 'info',
    url: `${runtime.accountId ? `https://${runtime.accountId}.app.netsuite.com` : ''}/app/common/entity/custjob.nl?id=${rec.id}`,
    space: 'sales',
    fields: [
      { label: 'Email', value: email || '—' },
      { label: 'Source', value: leadSource || '—' },
      { label: 'Sales Rep', value: salesRep || 'Unassigned' },
    ],
  });
};
```
