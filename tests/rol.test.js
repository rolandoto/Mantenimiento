// describe("GET /rol/getRols", () => {
//     it("Requests all rols", (done) => {
//         supertest(request)
//             .get("/rol/getRols")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect(200)
//             .end((err) => {
//                 if (err) return done(err);

//                 done();
//             });
//     });
// });

// describe("GET /rol/getRol/:id", () => {
//     it("Requests specific rol", (done) => {
//         supertest(request)
//             .get("/rol/getRol/5fd509c32306da03d4be80bb")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(200);
//                 expect(response.body.message).eql("Se ha encontrado el rol.");
//             })
//             .end((err) => {
//                 if (err) return done(err);

//                 done();
//             });
//     });

//     it("Requests bad specific rol", (done) => {
//         supertest(request)
//             .get("/rol/getRol/asdasd")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).eql("Ha ocurrido un error");
//             })
//             .end((err) => {
//                 if (err) return done(err);

//                 done();
//             });
//     });
// });

// describe("POST /rol/createRol", (_) => {
//     it("create a new rol", (done) => {
//         supertest(request)
//             .post("/rol/createRol")
//             .send({
//                 name: "user",
//             })
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(201);
//                 expect(response.body.message).eql("El rol se ha creado correctamente.");
//             })
//             .end((err) => {
//                 if (err) return done(err);

//                 done();
//             });
//     });

//     it("create a new bad rol", (done) => {
//         supertest(request)
//             .post("/rol/createRol")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

// describe("PUT /rol/updateRol", (_) => {
//     it("Update an existing rol", (done) => {
//         supertest(request)
//             .put("/rol/updateRol")
//             .send({
//                 rolID: "5fd566d14a81d20dd389b6fb",
//                 name: "test",
//             })
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(200);
//                 expect(response.body.message).to.eql("El rol se ha actualizado correctamente.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Update an existing rol, no send values", (done) => {
//         supertest(request)
//             .put("/rol/updateRol")
//             .send({
//                 rolID: "5fd566d14a81d20dd389b6fb",
//             })
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("Debes llenar los campos requeridos.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Update an existing rol, no send ID", (done) => {
//         supertest(request)
//             .put("/rol/updateRol")
//             .send({
//                 name: "test",
//             })
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El ID es requerido.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

// describe("DELETE /rol/deleteRol", (_) => {
//     it("delete an existing rol, without ID", (done) => {
//         supertest(request)
//             .delete("/rol/deleteRol")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El ID es requerido.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("delete an existing rol, bad ID", (done) => {
//         supertest(request)
//             .delete("/rol/deleteRol")
//             .send({
//                 rolID: "Hola",
//             })
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("Ha ocurrido un error, intentalo nuevamente.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("delete an existing rol", (done) => {
//         supertest(request)
//             .delete("/rol/deleteRol")
//             .send({
//                 rolID: "5fd566d14a81d20dd389b6fb",
//             })
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(200);
//                 expect(response.body.message).to.eql("El rol fue eliminado correctamente.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("delete an existing rol, not exist", (done) => {
//         supertest(request)
//             .delete("/rol/deleteRol")
//             .send({
//                 rolID: "5fd566d14a81d20dd389b6fb",
//             })
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("No se ha encontrado el recurso solicitado.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });
