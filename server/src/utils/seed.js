import { faker } from '@faker-js/faker';

function generateUser(id) {
    return {
        id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        job: faker.person.jobTitle(),
    }
}

function generateUsers(count = 200) {
    return Array.from({ length: count }, (v, i) => generateUser(i + 1))
}

export default generateUsers
