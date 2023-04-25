const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_PRODUCT",
	properties: [
		{
			name: "Id",
			column: "PRODUCT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "PRODUCT_NAME",
			type: "VARCHAR",
		},
 {
			name: "Code",
			column: "PRODUCT_PROPERTY3",
			type: "VARCHAR",
		},
 {
			name: "Type",
			column: "PRODUCT_PRODUCTTYPEID",
			type: "INTEGER",
		},
 {
			name: "Group",
			column: "PRODUCT_PRODUCTGROUPID",
			type: "INTEGER",
		},
 {
			name: "ManufacturerCode",
			column: "PRODUCT_MANUFACTURERCODE",
			type: "VARCHAR",
		},
 {
			name: "UoM",
			column: "PRODUCT_UOM",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_PRODUCT",
		key: {
			name: "Id",
			column: "PRODUCT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PRODUCT",
		key: {
			name: "Id",
			column: "PRODUCT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PRODUCT",
		key: {
			name: "Id",
			column: "PRODUCT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PRODUCT"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("hermes-app/Products/Product/" + operation).send(JSON.stringify(data));
}