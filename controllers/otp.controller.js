const { encode, decode } = require("../services/crypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

const otpGenerator = require("otp-generator");

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const newOtp = async (req, res) => {
  const { phone_number } = req.body;
  // Genetare otp
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const now = new Date();
  const expiration_time = AddMinutesToDate(now, 3);

  const newOtp = await pool.query(
    `Insert into otp (id, otp, expiration_time) values ($1, $2, $3) returning id`,
    [uuidv4(), otp, expiration_time]
  );

  const details = {
    timestamp: now,
    check: phone_number,
    success: true,
    message: "OTP sent to user",
    otp_id: newOtp.rows[0].id,
  };
  //console.log(details)
  const encoded = await encode(JSON.stringify(details));
  return res.send({ Status: "Success", details: encoded });
};

const dates = {
  convert: function (d) {
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    console.log(a,b);
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d < +end
      : NaN;
  },
};

const get = async (req, res) => {
  try {
    const obje = await pool.query(
      `
        select * from client
        `
    );
    res.status(200).json(obje.rows);
  } catch (e) {
    res.status(500).json(`Xatolik: ${e.message}`);
  }
};

const verifyOTP = async (req, res) => {
  const { verification_key, otp, check } = req.body;
  var currentdate = new Date();
  let decoded;
  try {
    decoded = await decode(verification_key);
  } catch (err) {
    const response = { Status: "Failure", Details: "Bad request" };
    return res.status(400).send(response);
  }

  var obj = JSON.parse(decoded);
  const check_obj = obj.check;
  console.log(obj);
  if (check_obj != check) {
    const response = {
      Status: "Failure",
      Details: " OTP wasn't sent to this particular phone number",
    };
    return res.status(400).send(response);
  }

  const otpResult = await pool.query(`select * from otp where id = $1`, [
    obj.otp_id,
  ]);
  const result = otpResult.rows[0];
  if (result != null) {
    // Check if otp is already used or not
    if (result.verified != true) {
      // Check if otp is expired or not
      if (dates.compare(result.expiration_time, currentdate) == 1) {
        // Check if otp is equal to the OTP in the DB
        if (otp == result.otp) {
            await pool.query(`Update otp set verified = $2 where id = $1`, [
                result.id,
                true
            ])
            const clientResult = await pool.query(
                `Select * from client where client_phone_number = $1`,
                [check]
            )
            if (clientResult.rows.length == 0){
                const response = {
                    Status: "Success",
                    Details: "new",
                    Check: check
                }
                return res.status(200).send(response)
            } else{
                const response = {
                    Status: "Success",
                    Details: "old",
                    Check: check,
                    ClientName: clientResult.rows[0].client_first_name
                }
                return res.status(200).send(response)
            }
        } else {
          const response = {
            Status: "Filure",
            Details: "OTP not matched",
          };
          return res.status(400).send(response);
        }
      } else {
        const response = {
          Status: "Filure",
          Details: "OTP expired",
        };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: "Filure", Details: "OTP already used" };
      return res.status(400).send(response);
    }
  } else {
    const response = { Status: "Filure", Details: "Bad request" };
    return res.status(400).send(response);
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.id;
    const obje = await pool.query(
      `
        select * from client where id = $1 returning *
        `,
      [id]
    );
    res.status(200).json(obje.rows);
  } catch (e) {
    res.status(500).json(`Xatolik: ${e.message}`);
  }
};

const update = async (req, res) => {
  try {
    const { neww } = req.body;
    const id = req.id;
    const obje = await pool.query(
      `
        update client set client_first_name = $1 where id = $2 returning *
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
        delete from client where id = $1 returning *
        `,
      [id]
    );
    res.status(200).json({
      message: "Deleted",
      id,
    });
  } catch (e) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
  newOtp,
  get,
  getOne,
  update,
  deleteOne,
  verifyOTP
};
