const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(`prostgress://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        

         CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );
        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            date DATE NOT NULL DEFAULT now(),
            party_count INTEGER NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurant(id) NOT NULL
        );
    `;

    await client.query(SQL);
}

const createCustomer = async (customer) => {
    const SQL = "INSERT INTO customer(id,name) VALUES($1, $2) RETURNING *";
    const response = await client.query(SQL, [uuid.v4(), customer]);
    return response.rows[0];
}

const createRestaurant = async (restaurant) => {
     const SQL = "INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *";
     const response = await client.query(SQL, [uuid.v4(), restaurant]);
     return response.rows[0];
};

const createReservation = async ({customer_id, restaurant_id, date, party_count}) => {
    const SQL = `
         INSERT INTO vacations(id, customer_id, restaurant_id, date, party_count) VALUES($1, $2, $3, $4, $5) RETURNING *;
    `;
    const response = await client.query(SQL, [
         uuid.v4(),
         customer_id,
         restaurant_id,
         date,
         party_count,
    ]);
    return response.rows[0];
}


const seed = async () => {

    createCustomer("chris"),
    createRestaurant("Arbys")
}


// await Promise.all([
//      createReservation({
//         // continue from here refer to
//      }),
// ]);
module.exports = {

    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    seed,
}