import { PrismaService } from '../../src/prisma/prisma.service';
import { Migration } from '../cli/migration';

const prisma = new PrismaService();

export default class implements Migration {
  async up() {
    /**
     * # ToDo: Create a migration that creates all tables for the following user stories
     *
     * For an example on how a UI for an API using this might look like, please try to book a show at https://in.bookmyshow.com/.
     * To not introduce additional complexity, please consider only one cinema.
     *
     * Please list the tables that you would create including keys, foreign keys, and attributes that are required by the user stories.
     *
     * ## User Stories
     *
     * **Movie exploration**
     * As a user, I want to see which films can be watched and at what times
     * As a user, I want to only see the shows which are not booked out
     *
     * **Show administration**
     * As a cinema owner, I want to run different films at different times
     * As a cinema owner, I want to run multiple films at the same time in different showrooms
     *
     * **Pricing**
     * As a cinema owner, I want to get paid differently per show
     * As a cinema owner, I want to give different seat types a percentage premium, for example 50% more for VIP seat
     *
     * **Seating**
     * As a user, I want to book a seat
     * As a user, I want to book a VIP seat/couple seat/super VIP/whatever
     * As a user, I want to see which seats are still available
     * As a user, I want to know where I'm sitting on my ticket
     * As a cinema owner, I don't want to configure the seating for every show
     */
    // Create tables using Prisma raw SQL queries
    try {
      await prisma.$queryRaw`
      CREATE TABLE Movie (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        description VARCHAR(255)
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE Show (
        id INT PRIMARY KEY,
        startTime DATETIME,
        endTime DATETIME,
        isBookedOut BOOLEAN DEFAULT FALSE,
        cinemaId INT REFERENCES Cinema(id),
        movieId INT REFERENCES Movie(id)
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE Cinema (
        id INT PRIMARY KEY,
        name VARCHAR(255)
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE Pricing (
        id INT PRIMARY KEY,
        showId INT REFERENCES Show(id),
        price FLOAT
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE SeatType (
        id INT PRIMARY KEY,
        name VARCHAR(255),
        premiumPercentage FLOAT
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE Seat (
        id INT PRIMARY KEY,
        showId INT REFERENCES Show(id),
        seatTypeId INT REFERENCES SeatType(id),
        row INT,
        number INT,
        isBooked BOOLEAN DEFAULT FALSE
        -- Add any other required attributes
      )`;

      await prisma.$queryRaw`
      CREATE TABLE Booking (
        id INT PRIMARY KEY,
        showId INT REFERENCES Show(id),
        seatId INT REFERENCES Seat(id),
        userId INT
        -- Add any other required attributes
      )`;
    } catch (e) {
      console.error(e);
    } finally {
      await prisma.$disconnect();
    }
  }

  async down() {
    // do nothing
  }
}
