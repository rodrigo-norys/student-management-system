const firstNames = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro', 'Quintino', 'Rafael', 'Sofia', 'Tiago', 'Ursula', 'Victor', 'Wanessa', 'Xavier', 'Yasmin', 'Zeca', 'Alice', 'Bernardo'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const students = [];
const addresses = [];

for (let i = 0; i < 27; i++) {
  students.push({
    name: firstNames[i],
    last_name: lastNames[i],
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}${i}@example.com`,
    registration_number: `2026${String(i + 1).padStart(4, '0')}`,
    cpf: String(11111111100 + i),
    birth_date: `2010-05-${String((i % 28) + 1).padStart(2, '0')}`,
    blood_type: bloodTypes[i % bloodTypes.length],
    medical_notes: '',
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', students, {});

    const insertedStudents = await queryInterface.sequelize.query(
      `SELECT id, email FROM students WHERE email LIKE '%@example.com';`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let i = 0; i < insertedStudents.length; i++) {
      addresses.push({
        zip_code: `22222-${String(100 + i).padStart(3, '0')}`,
        street: `Street ${firstNames[i]}`,
        number: String(10 + i),
        complement: 'Apt 1',
        neighborhood: 'Downtown',
        city: 'Rio de Janeiro',
        state: 'RJ',
        student_id: insertedStudents[i].id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('addresses', addresses, {});
  }

  export async function down (queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM addresses WHERE student_id IN (SELECT id FROM students WHERE email LIKE '%@example.com');`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM students WHERE email LIKE '%@example.com';`
    );
  }
