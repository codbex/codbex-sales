const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_DELIVERYEVENT",
	properties: [
		{
			name: "Id",
			column: "DELIVERYEVENT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Delivery",
			column: "DELIVERYEVENT_DELIVERY",
			type: "INTEGER",
		},
 {
			name: "Timestamp",
			column: "DELIVERYEVENT_TIMESTAMP",
			type: "VARCHAR",
		},
 {
			name: "Note",
			column: "DELIVERYEVENT_NOTE",
			type: "VARCHAR",
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
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: id
		}
	});
};

exports.count = function () {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DELIVERYEVENT" WHERE  = ?', []);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DELIVERYEVENT"');
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
	producer.queue("hermes-app/Deliveries/DeliveryEvent/" + operation).send(JSON.stringify(data));
}