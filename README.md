# sequelize-crud
sequelize utilitary from fast CRUD

## Getting Started

### methods to migrations

```js
import { createTable, dropTable } from 'sequelize-crud/lib/models/migration';

const tableName = 'User';
const defineTable = Sequelize => ({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
  },
});

export default {
  up: createTable(tableName, defineTable),
  down: dropTable(tableName),
}
```

or 
```js
import { createAndDropTable } from 'sequelize-crud/lib/models/migration';
...
export default createAndDropTable(tableName, defineTable);
```

define fields
```js
import { timestampsColumns } from 'sequelize-crud/lib/models/migration';

...timestampsColumns(Sequelize), = 
{
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
  deletedAt: { type: Sequelize.DATE },
})

```
```js
import { defaultColumns } from 'sequelize-crud/lib/models/migration';

...defaultColumns(Sequelize), = 
{
  externalId: { type: Sequelize.INTEGER },
  active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
  deletedAt: { type: Sequelize.DATE },
})

import { activeAndExternalField } from 'sequelize-crud/lib/models/migration';

...activeAndExternalField(Sequelize) = 
externalId: { type: Sequelize.INTEGER },
active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  
```

for seeders

```js
import { insertAndDeleteTableItems } from 'sequelize-crud/lib/models/migration';

const tableName = 'User';
const data = [
  { name: 'name1' },
  { name: 'name2' },
];

export default insertAndDeleteTableItems(tableName, data);

```

or 
this do User.create() for all items en data
```js
import { insertAndDeleteTableItems } from 'sequelize-crud/lib/models/migration';
import models from 'path of models';

const tableName = 'User';
const data = [
  { name: 'name1' },
  { name: 'name2' },
];

export default insertAndDeleteTableItems(tableName, data, models.User);

```
or ... for precalculate data
```js
import { insertAndDeleteTableItems } from 'sequelize-crud/lib/models/migration';
import models from 'path of models';

const tableName = 'User';
const data = async () => ([
  { name: 'name1' },
  { name: 'name2' },
]);

export default insertAndDeleteTableItems(tableName, getData);

```

