const pool = require("../config/db")
const deviceDetector = require("node-device-detector")
const deviceHelper = require("node-device-detector/helper")

const detector = new deviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const add = async (req, res) => {
  try {
    const {
      id,
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo,
    } = req.body;
    console.log(1);
    const neww = await pool.query(
      `
        insert into client (id,client_last_name, client_first_name,
            client_phone_number,client_info,client_photo)
            values($1, $2, $3, $4, $5, $6) returning *
        `,
      [id,
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,
      ]
    );
    console.log(2);
    console.log(neww.rows);
    res.status(200).json(neww.rows)
  } catch (e) {
    res.status(500).json(`Xatolik: ${e.message}`,);
  }
};

const get = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"]
    console.log(userAgent);
    const result = detector.detect(userAgent)
    console.log("result parse", result);
    console.log(deviceHelper.isDesktop(result));
    const obje = await pool.query(
      `
        select * from client
        `
    );
    res.status(200).json(obje.rows)
  } catch (e) {
        res.status(500).json(`Xatolik: ${e.message}`);
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.id
    const obje = await pool.query(
      `
        select * from client where id = $1 returning *
        `, [id]
    );
    res.status(200).json(obje.rows);
  } catch (e) {
    res.status(500).json(`Xatolik: ${e.message}`);
    
  }
};

const update = async (req, res) => {
  try {
    const {neww} = req.body
    const id = req.id;
    const obje = await pool.query(
      `
        update client set client_first_name = $1 where id = $2 returning *
        `,
      [neww, id]
    );
    res.status(200).json({
        message: "Updated"
    });
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.id;
    const obje = await pool.query(
      `
        delete from client where id = $1 returning *
        `,
      [id]
    );
    res.status(200).json({
        message: "Deleted",
        id
    });
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
    add, 
    get,
    getOne,
    update,
    deleteOne
}