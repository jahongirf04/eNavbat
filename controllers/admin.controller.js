const pool = require("../config/db");

const add = async (req, res) => {
  try {
    const {
      admin_name,
      admin_phone_number,
      admin_hashed_password
    } = req.body;

    const neww = await pool.query(
      `
        insert into admin (admin_name, admin_phone_number,
      admin_hashed_password)
            values($1, $2, $3, $4, $5) returning *
        `,
      [
        admin_name,
        admin_phone_number,
        admin_hashed_password
      ]
    );
    console.log(neww);
    res.status(200).json(neww.rows);
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

const get = async (req, res) => {
  try {
    const obje = await pool.query(
      `
        select * from admin returning *
        `
    );
    res.status(200).json(obje);
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.id;
    const obje = await pool.query(
      `
        select * from admin where id = $1 returning *
        `,
      [id]
    );
    res.status(200).json(obje);
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

const update = async (req, res) => {
  try {
    const { neww } = req.body;
    const id = req.id;
    const obje = await pool.query(
      `
        update admin set admin_name = $1 where id = $2 returning *
        `,
      [neww, id]
    );
    res.status(200).json({
      message: "Updated",
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
        delete from admin where id = $1 returning *
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
  deleteOne,
};
