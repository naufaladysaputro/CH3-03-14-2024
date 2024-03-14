const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8000;

// middleware untuk membaca json dari req body
app.use(express.json());

// read file json secara asynchronous
fs.readFile(`${__dirname}/data/dummy.json`, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  const customers = JSON.parse(data);

  app.get("/", (req, res, next) => {
    res.send("apaaa ajaa");
  });

  // api untuk mendapatkan semua data pelanggan
  app.get("/api/v1/customers", (req, res, next) => {
    res.status(200).json({
      status: "success",
      data: {
        customers,
      },
    });
  });

  // api untuk mendapatkan data pelanggan berdasarkan ID
  app.get("/api/v1/customers/:id", (req, res, next) => {
    const customerId = req.params.id;
    const customer = customers.find((cust) => cust._id === customerId);

    if (!customer) {
      return res.status(404).json({
        status: "fail",
        message: `Customer dengan ID: ${customerId} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  });

  // api untuk memperbarui data pelanggan berdasarkan ID
  app.patch("/api/v1/customers/:id", (req, res) => {
    const id = req.params.id;
    const customerIndex = customers.findIndex((cust) => cust._id === id);

    if (customerIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: `Customer dengan ID: ${id} tidak ditemukan`,
      });
    }

    customers[customerIndex] = { ...customers[customerIndex], ...req.body };

    fs.writeFile(
      `${__dirname}/data/dummy.json`,
      JSON.stringify(customers),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Gagal menyimpan perubahan ke berkas",
          });
        }
        res.status(200).json({
          status: "success",
          message: "Berhasil memperbarui data",
          data: {
            customer: customers[customerIndex],
          },
        });
      }
    );
  });

  // api untuk menambahkan data pelanggan baru
  app.post("/api/v1/customers", (req, res) => {
    const newCustomer = req.body;

    customers.push(newCustomer);
    fs.writeFile(
      `${__dirname}/data/dummy.json`,
      JSON.stringify(customers),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Gagal menyimpan data ke berkas",
          });
        }
        res.status(201).json({
          status: "success",
          data: {
            customer: newCustomer,
          },
        });
      }
    );
  });

  //
  app.delete("/api/v1/customers/:id", (req, res) => {
    const id = req.params.id;
    const customerIndex = customers.findIndex((cust) => cust._id === id);
  
    if (customerIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: `Customer dengan ID: ${id} tidak ditemukan`,
      });
    }
  
    customers.splice(customerIndex, 1);
  
    fs.writeFile(
      `${__dirname}/data/dummy.json`,
      JSON.stringify(customers),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Gagal menyimpan perubahan ke berkas",
          });
        }
        res.status(200).json({
          status: "success",
          message: "Berhasil menghapus data",
        });
      }
    );
  });

  app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
  });
});