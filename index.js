var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import path3 from "path";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  academyTypes: () => academyTypes,
  anonymousPosts: () => anonymousPosts,
  blogPosts: () => blogPosts,
  contacts: () => contacts,
  courses: () => courses,
  faculty: () => faculty,
  gallery: () => gallery,
  insertAnonymousPostSchema: () => insertAnonymousPostSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertContactSchema: () => insertContactSchema,
  insertCourseSchema: () => insertCourseSchema,
  insertFacultySchema: () => insertFacultySchema,
  insertGallerySchema: () => insertGallerySchema,
  insertNewsSchema: () => insertNewsSchema,
  insertSiteTextSchema: () => insertSiteTextSchema,
  insertUserSchema: () => insertUserSchema,
  news: () => news,
  siteTexts: () => siteTexts,
  users: () => users
});
import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var academyTypes = ["lumen", "gratia_elementary", "gratia_college"];
var faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKo: text("name_ko").notNull(),
  department: text("department").notNull(),
  departmentKo: text("department_ko").notNull(),
  bio: text("bio").notNull(),
  bioKo: text("bio_ko").notNull(),
  imageUrl: text("image_url"),
  email: text("email"),
  linkedin: text("linkedin"),
  academyType: text("academy_type").notNull().$type()
  // lumen, gratia_elementary, gratia_college
});
var insertFacultySchema = createInsertSchema(faculty).omit({
  id: true
});
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleKo: text("title_ko").notNull(),
  category: text("category").notNull(),
  // math, science, english
  level: text("level").notNull(),
  // elementary, middle, high
  description: text("description").notNull(),
  descriptionKo: text("description_ko").notNull(),
  hours: text("hours").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  // 1-5
  academyType: text("academy_type").notNull().$type()
  // lumen, gratia_elementary, gratia_college
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true
});
var news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleKo: text("title_ko").notNull(),
  content: text("content").notNull(),
  contentKo: text("content_ko").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  category: text("category").notNull(),
  // announcement, event, achievement
  imageUrl: text("image_url"),
  academyType: text("academy_type").notNull().$type()
  // lumen, gratia_elementary, gratia_college
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true
});
var gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleKo: text("title_ko").notNull(),
  description: text("description"),
  descriptionKo: text("description_ko"),
  imageUrl: text("image_url").notNull(),
  academyType: text("academy_type").notNull().$type()
  // lumen, gratia_elementary, gratia_college
});
var insertGallerySchema = createInsertSchema(gallery).omit({
  id: true
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  academyType: text("academy_type").$type(),
  // lumen, gratia_elementary, gratia_college
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false)
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true
});
var anonymousPosts = pgTable("anonymous_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  academyType: text("academy_type").$type(),
  // lumen, gratia_elementary, gratia_college
  isRead: boolean("is_read").notNull().default(false),
  password: text("password")
  // Optional password for editing/deleting
});
var insertAnonymousPostSchema = createInsertSchema(anonymousPosts).omit({
  id: true,
  createdAt: true,
  isRead: true
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleKo: text("title_ko").notNull(),
  content: text("content").notNull(),
  contentKo: text("content_ko").notNull(),
  summary: text("summary").notNull(),
  summaryKo: text("summary_ko").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  authorKo: text("author_ko").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  tags: text("tags").array(),
  // Array of tags
  academyType: text("academy_type").$type(),
  // Optional: specific academy section
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0)
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  views: true
});
var siteTexts = pgTable("site_texts", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  // e.g., "hero.title", "contact.address"
  textEn: text("text_en").notNull(),
  textKo: text("text_ko").notNull(),
  category: text("category").notNull(),
  // e.g., "hero", "contact", "about"
  description: text("description"),
  // Admin description of what this text is for
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertSiteTextSchema = createInsertSchema(siteTexts).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, asc } from "drizzle-orm";
import bcrypt from "bcrypt";
var DatabaseStorage = class {
  // Database setup
  async setupDatabase() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "session" (
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL,
          CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
        );
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY,
          "username" text NOT NULL UNIQUE,
          "password" text NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "faculty" (
          "id" serial PRIMARY KEY,
          "name" text NOT NULL,
          "name_ko" text NOT NULL,
          "department" text NOT NULL,
          "department_ko" text NOT NULL,
          "bio" text NOT NULL,
          "bio_ko" text NOT NULL,
          "image_url" text,
          "email" text,
          "linkedin" text,
          "academy_type" text NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "courses" (
          "id" serial PRIMARY KEY,
          "title" text NOT NULL,
          "title_ko" text NOT NULL,
          "category" text NOT NULL,
          "level" text NOT NULL,
          "description" text NOT NULL,
          "description_ko" text NOT NULL,
          "hours" text NOT NULL,
          "image_url" text,
          "rating" integer,
          "academy_type" text NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "news" (
          "id" serial PRIMARY KEY,
          "title" text NOT NULL,
          "title_ko" text NOT NULL,
          "content" text NOT NULL,
          "content_ko" text NOT NULL,
          "date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
          "category" text NOT NULL,
          "image_url" text,
          "academy_type" text NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "gallery" (
          "id" serial PRIMARY KEY,
          "title" text NOT NULL,
          "title_ko" text NOT NULL,
          "description" text,
          "description_ko" text,
          "image_url" text NOT NULL,
          "academy_type" text NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "contacts" (
          "id" serial PRIMARY KEY,
          "name" text NOT NULL,
          "email" text NOT NULL,
          "subject" text,
          "message" text NOT NULL,
          "academy_type" text,
          "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
          "is_read" boolean DEFAULT false NOT NULL
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "anonymous_posts" (
          "id" serial PRIMARY KEY,
          "title" text NOT NULL,
          "content" text NOT NULL,
          "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
          "academy_type" text,
          "is_read" boolean DEFAULT false NOT NULL,
          "password" text
        );
      `);
      console.log("Database tables created successfully");
    } catch (error) {
      console.error("Error creating database tables:", error);
      throw error;
    }
  }
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({ ...insertUser, password: hashedPassword }).returning();
    return user;
  }
  async authenticateUser(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    return user;
  }
  async changePassword(username, oldPassword, newPassword) {
    const user = await this.getUserByUsername(username);
    if (!user) return false;
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) return false;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const [updatedUser] = await db.update(users).set({ password: hashedNewPassword }).where(eq(users.username, username)).returning();
    return !!updatedUser;
  }
  // Faculty
  async getFaculty(academyType) {
    if (academyType) {
      return db.select().from(faculty).where(eq(faculty.academyType, academyType)).orderBy(asc(faculty.id));
    }
    return db.select().from(faculty).orderBy(asc(faculty.id));
  }
  async getFacultyById(id) {
    const [facultyMember] = await db.select().from(faculty).where(eq(faculty.id, id));
    return facultyMember;
  }
  async createFaculty(insertFaculty) {
    const typedInsert = {
      ...insertFaculty,
      academyType: insertFaculty.academyType
    };
    const [facultyMember] = await db.insert(faculty).values(typedInsert).returning();
    return facultyMember;
  }
  async updateFaculty(id, facultyData) {
    const typedData = { ...facultyData };
    if (typedData.academyType) {
      typedData.academyType = typedData.academyType;
    }
    const [updatedFaculty] = await db.update(faculty).set(typedData).where(eq(faculty.id, id)).returning();
    return updatedFaculty;
  }
  async deleteFaculty(id) {
    const result = await db.delete(faculty).where(eq(faculty.id, id));
    return true;
  }
  // Courses
  async getCourses(academyType) {
    if (academyType) {
      return db.select().from(courses).where(eq(courses.academyType, academyType)).orderBy(asc(courses.id));
    }
    return db.select().from(courses).orderBy(asc(courses.id));
  }
  async getCourseById(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  async getCoursesByCategory(category, academyType) {
    if (academyType) {
      return db.select().from(courses).where(and(
        eq(courses.category, category),
        eq(courses.academyType, academyType)
      )).orderBy(asc(courses.id));
    }
    return db.select().from(courses).where(eq(courses.category, category)).orderBy(asc(courses.id));
  }
  async createCourse(insertCourse) {
    const typedCourse = {
      ...insertCourse,
      academyType: insertCourse.academyType
    };
    const [course] = await db.insert(courses).values([typedCourse]).returning();
    return course;
  }
  async updateCourse(id, courseData) {
    let typedCourseData = { ...courseData };
    if (typeof courseData.academyType === "string" && ["lumen", "gratia_elementary", "gratia_college"].includes(courseData.academyType)) {
      typedCourseData.academyType = courseData.academyType;
    }
    const [updatedCourse] = await db.update(courses).set(typedCourseData).where(eq(courses.id, id)).returning();
    return updatedCourse;
  }
  async deleteCourse(id) {
    await db.delete(courses).where(eq(courses.id, id));
    return true;
  }
  // News
  async getNews(academyType) {
    if (academyType) {
      return db.select().from(news).where(eq(news.academyType, academyType)).orderBy(desc(news.date));
    }
    return db.select().from(news).orderBy(desc(news.date));
  }
  async getNewsById(id) {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }
  async createNews(insertNews) {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }
  async updateNews(id, newsData) {
    const [updatedNews] = await db.update(news).set(newsData).where(eq(news.id, id)).returning();
    return updatedNews;
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
    return true;
  }
  // Gallery
  async getGallery(academyType) {
    if (academyType) {
      return db.select().from(gallery).where(eq(gallery.academyType, academyType)).orderBy(asc(gallery.id));
    }
    return db.select().from(gallery).orderBy(asc(gallery.id));
  }
  async createGallery(insertGallery) {
    const validAcademyType = academyTypes.includes(insertGallery.academyType) ? insertGallery.academyType : "lumen";
    const [galleryItem] = await db.insert(gallery).values({
      ...insertGallery,
      academyType: validAcademyType
    }).returning();
    return galleryItem;
  }
  async updateGallery(id, galleryData) {
    let updateData = { ...galleryData };
    if (galleryData.academyType) {
      const validAcademyType = academyTypes.includes(galleryData.academyType) ? galleryData.academyType : "lumen";
      updateData.academyType = validAcademyType;
    }
    const [updatedGallery] = await db.update(gallery).set(updateData).where(eq(gallery.id, id)).returning();
    return updatedGallery;
  }
  async deleteGallery(id) {
    await db.delete(gallery).where(eq(gallery.id, id));
    return true;
  }
  // Contacts
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  async getContacts(academyType) {
    if (academyType) {
      return db.select().from(contacts).where(eq(contacts.academyType, academyType)).orderBy(desc(contacts.createdAt));
    }
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async markContactAsRead(id) {
    await db.update(contacts).set({ isRead: true }).where(eq(contacts.id, id));
    return true;
  }
  async deleteContact(id) {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }
  // Initialize default admin account if none exists
  async initializeDefaultAdmin() {
    try {
      const existingUsers = await db.select().from(users);
      if (existingUsers.length === 0) {
        await this.createUser({
          username: "admin",
          password: "password123"
          // This should be changed immediately after first login
        });
        console.log("Created default admin user");
      }
    } catch (error) {
      console.error("Error initializing admin:", error);
      await this.setupDatabase();
      const hashedPassword = await bcrypt.hash("password123", 10);
      await pool.query(`
        INSERT INTO "users" ("username", "password")
        VALUES ('admin', $1)
        ON CONFLICT (username) DO NOTHING;
      `, [hashedPassword]);
    }
  }
  // Anonymous Posts methods
  async getAnonymousPosts() {
    try {
      return db.select().from(anonymousPosts).orderBy(desc(anonymousPosts.createdAt));
    } catch (error) {
      console.error("Error fetching anonymous posts:", error);
      return [];
    }
  }
  async getAnonymousPostById(id) {
    try {
      const [post] = await db.select().from(anonymousPosts).where(eq(anonymousPosts.id, id));
      return post;
    } catch (error) {
      console.error(`Error fetching anonymous post with id ${id}:`, error);
      return void 0;
    }
  }
  async createAnonymousPost(insertPost) {
    try {
      let postData = { ...insertPost };
      if (postData.password) {
        postData.password = await bcrypt.hash(postData.password, 10);
      }
      const [post] = await db.insert(anonymousPosts).values(postData).returning();
      return post;
    } catch (error) {
      console.error("Error creating anonymous post:", error);
      throw new Error("Failed to create anonymous post");
    }
  }
  async markAnonymousPostAsRead(id) {
    try {
      await db.update(anonymousPosts).set({ isRead: true }).where(eq(anonymousPosts.id, id));
      return true;
    } catch (error) {
      console.error(`Error marking anonymous post ${id} as read:`, error);
      return false;
    }
  }
  async deleteAnonymousPost(id, password) {
    try {
      if (password) {
        const post = await this.getAnonymousPostById(id);
        if (!post) {
          return false;
        }
        if (post.password) {
          const isValid = await bcrypt.compare(password, post.password);
          if (!isValid) {
            return false;
          }
        }
      }
      await db.delete(anonymousPosts).where(eq(anonymousPosts.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting anonymous post ${id}:`, error);
      return false;
    }
  }
  // Blog Posts implementation
  async getBlogPosts(academyType, limit) {
    try {
      let query = db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
      if (academyType) {
        query = query.where(eq(blogPosts.academyType, academyType));
      }
      if (limit) {
        query = query.limit(limit);
      }
      return await query;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }
  async getFeaturedBlogPosts(limit = 4) {
    try {
      return await db.select().from(blogPosts).where(eq(blogPosts.featured, true)).orderBy(desc(blogPosts.publishedAt)).limit(limit);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      return [];
    }
  }
  async getBlogPostById(id) {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post;
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      return void 0;
    }
  }
  async getBlogPostsByTag(tag, limit) {
    try {
      const query = `
        SELECT * FROM blog_posts 
        WHERE $1 = ANY(tags)
        ORDER BY published_at DESC
        ${limit ? `LIMIT ${limit}` : ""}
      `;
      const result = await pool.query(query, [tag]);
      return result.rows;
    } catch (error) {
      console.error(`Error fetching blog posts by tag ${tag}:`, error);
      return [];
    }
  }
  async createBlogPost(post) {
    try {
      const [newPost] = await db.insert(blogPosts).values(post).returning();
      return newPost;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw new Error("Failed to create blog post");
    }
  }
  async updateBlogPost(id, postData) {
    try {
      const [updatedPost] = await db.update(blogPosts).set(postData).where(eq(blogPosts.id, id)).returning();
      return updatedPost;
    } catch (error) {
      console.error(`Error updating blog post ${id}:`, error);
      return void 0;
    }
  }
  async incrementBlogPostViews(id) {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      if (!post) {
        return false;
      }
      await db.update(blogPosts).set({ views: post.views + 1 }).where(eq(blogPosts.id, id));
      return true;
    } catch (error) {
      console.error(`Error incrementing views for blog post ${id}:`, error);
      return false;
    }
  }
  async deleteBlogPost(id) {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      return false;
    }
  }
  // Site texts management
  async getSiteTexts() {
    try {
      const texts = await db.select().from(siteTexts).orderBy(asc(siteTexts.category), asc(siteTexts.key));
      return texts;
    } catch (error) {
      console.error("Error fetching site texts:", error);
      return [];
    }
  }
  async getSiteTextByKey(key) {
    try {
      const [text2] = await db.select().from(siteTexts).where(eq(siteTexts.key, key));
      return text2;
    } catch (error) {
      console.error(`Error fetching site text ${key}:`, error);
      return void 0;
    }
  }
  async createSiteText(insertText) {
    try {
      const [text2] = await db.insert(siteTexts).values(insertText).returning();
      return text2;
    } catch (error) {
      console.error("Error creating site text:", error);
      throw error;
    }
  }
  async updateSiteText(id, textData) {
    try {
      const [text2] = await db.update(siteTexts).set({ ...textData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteTexts.id, id)).returning();
      return text2;
    } catch (error) {
      console.error(`Error updating site text ${id}:`, error);
      return void 0;
    }
  }
  async deleteSiteText(id) {
    try {
      const result = await db.delete(siteTexts).where(eq(siteTexts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting site text ${id}:`, error);
      return false;
    }
  }
  async initializeDefaultSiteTexts() {
    try {
      const existingTexts = await this.getSiteTexts();
      if (existingTexts.length > 0) return;
      const defaultTexts = [
        // Hero Section
        {
          key: "hero.title",
          textEn: "Lumen & Gratia Academy",
          textKo: "\uB8E8\uBA58&\uADF8\uB77C\uD2F0\uC544",
          category: "hero",
          description: "Main title in hero section"
        },
        {
          key: "hero.subtitle",
          textEn: "Excellence in Education Since 2009",
          textKo: "2009\uB144\uBD80\uD130 \uAD50\uC721 \uC6B0\uC218\uC131\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4",
          category: "hero",
          description: "Subtitle in hero section"
        },
        {
          key: "hero.principal.message",
          textEn: "We will be the door that opens the future for children. I am Kim Gi-tae, principal of Lumen Math & Science Gratia Language Academy.",
          textKo: "\uC544\uC774\uB4E4\uC758 \uBBF8\uB798\uB97C \uC5EC\uB294 \uBB38\uC774 \uB418\uACA0\uC2B5\uB2C8\uB2E4. \uB8E8\uBA58\uC218\uD559\uACFC\uD559\uADF8\uB77C\uD2F0\uC544\uC5B4\uD559\uC6D0 \uC6D0\uC7A5 \uAE40\uAE30\uD0DC\uC785\uB2C8\uB2E4.",
          category: "hero",
          description: "Principal's welcome message"
        },
        // Contact Information
        {
          key: "contact.address",
          textEn: "6th Floor, Plus Medical Center, 134 Suam-ro, Nam-gu, Ulsan",
          textKo: "\uC6B8\uC0B0\uAD11\uC5ED\uC2DC \uB0A8\uAD6C \uC218\uC554\uB85C 134, \uD50C\uB7EC\uC2A4\uBA54\uB514\uCEEC\uC13C\uD130 6\uCE35",
          category: "contact",
          description: "Academy address"
        },
        {
          key: "contact.phone",
          textEn: "052-272-0400",
          textKo: "052-272-0400",
          category: "contact",
          description: "Academy phone number"
        },
        {
          key: "contact.email",
          textEn: "info@lumenacademy.edu",
          textKo: "info@lumenacademy.edu",
          category: "contact",
          description: "Academy email address"
        },
        // Navigation Menu
        {
          key: "nav.about",
          textEn: "About",
          textKo: "\uC18C\uAC1C",
          category: "navigation",
          description: "About menu item"
        },
        {
          key: "nav.faculty",
          textEn: "Faculty",
          textKo: "\uAD50\uC9C1\uC6D0",
          category: "navigation",
          description: "Faculty menu item"
        },
        {
          key: "nav.courses",
          textEn: "Courses",
          textKo: "\uAC15\uC88C",
          category: "navigation",
          description: "Courses menu item"
        },
        {
          key: "nav.news",
          textEn: "News",
          textKo: "\uC18C\uC2DD",
          category: "navigation",
          description: "News menu item"
        },
        {
          key: "nav.gallery",
          textEn: "Gallery",
          textKo: "\uAC24\uB7EC\uB9AC",
          category: "navigation",
          description: "Gallery menu item"
        },
        {
          key: "nav.contact",
          textEn: "Contact",
          textKo: "\uBB38\uC758",
          category: "navigation",
          description: "Contact menu item"
        },
        // Academy Sections
        {
          key: "lumen.title",
          textEn: "Lumen Math & Science",
          textKo: "\uB8E8\uBA58 \uC218\uD559\uACFC\uD559",
          category: "academy",
          description: "Lumen academy name"
        },
        {
          key: "gratia.elementary.title",
          textEn: "Gratia Elementary",
          textKo: "\uADF8\uB77C\uD2F0\uC544 \uCD08\uB4F1",
          category: "academy",
          description: "Gratia elementary academy name"
        },
        {
          key: "gratia.college.title",
          textEn: "Gratia College Prep",
          textKo: "\uADF8\uB77C\uD2F0\uC544 \uC785\uC2DC",
          category: "academy",
          description: "Gratia college prep academy name"
        },
        // Footer
        {
          key: "footer.copyright",
          textEn: "\xA9 2024 Lumen Math & Science Gratia Language Academy. All rights reserved.",
          textKo: "\xA9 2024 \uB8E8\uBA58\uC218\uD559\uACFC\uD559\uADF8\uB77C\uD2F0\uC544\uC5B4\uD559\uC6D0. \uBAA8\uB4E0 \uAD8C\uB9AC \uBCF4\uC720.",
          category: "footer",
          description: "Copyright text"
        },
        {
          key: "footer.location",
          textEn: "Located near Homeplus Nam-gu",
          textKo: "\uD648\uD50C\uB7EC\uC2A4 \uB0A8\uAD6C\uC810 \uC778\uADFC \uC704\uCE58",
          category: "footer",
          description: "Academy email"
        },
        // Transportation Section
        {
          key: "transportation.title",
          textEn: "Transportation & Location",
          textKo: "\uD1B5\uD559 \uBC0F \uC704\uCE58 \uC548\uB0B4",
          category: "transportation",
          description: "Transportation section title"
        },
        {
          key: "transportation.description",
          textEn: "Convenient transportation services are provided for students' safe and comfortable commute. Our shuttle service operates at designated times to ensure students can attend classes safely.",
          textKo: "\uD559\uC6D0\uAE4C\uC9C0\uC758 \uC9C0\uC815\uB41C \uD53D\uC5C5 \uC9C0\uC810\uC5D0\uC11C \uD559\uC0DD\uB4E4\uC5D0\uAC8C \uC548\uC804\uD558\uACE0 \uC2E0\uB8B0\uD560 \uC218 \uC788\uB294 \uD1B5\uD559 \uC11C\uBE44\uC2A4\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4. \uC154\uD2C0 \uC11C\uBE44\uC2A4\uB294 \uD559\uC0DD\uB4E4\uC774 \uC2DC\uAC04\uC5D0 \uB9DE\uCDB0 \uB3C4\uCC29\uD558\uACE0 \uC548\uC804\uD558\uAC8C \uADC0\uAC00\uD560 \uC218 \uC788\uB3C4\uB85D \uD569\uB2C8\uB2E4.",
          category: "transportation",
          description: "Transportation service description"
        }
      ];
      for (const text2 of defaultTexts) {
        await this.createSiteText(text2);
      }
      console.log("Default site texts initialized");
    } catch (error) {
      console.error("Error initializing default site texts:", error);
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  const validateAcademyType = (type) => {
    if (!type) return void 0;
    return academyTypes.includes(type) ? type : void 0;
  };
  app2.get("/api/faculty", async (req, res) => {
    try {
      const faculty2 = [
        { id: 1, name: "Song Ji-yeon", nameKo: "\uC1A1\uC9C0\uC5F0", department: "Math Team Leader", departmentKo: "\uC218\uD559\uACFC\uD300\uC7A5", bio: "Math team leader specializing in middle and high school curriculum.", bioKo: "\uC911\uACE0\uB4F1 \uAD50\uC721\uACFC\uC815\uC744 \uC804\uBB38\uC73C\uB85C \uD558\uB294 \uC218\uD559\uD300\uC7A5", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 2, name: "Kim Myung-seon", nameKo: "\uAE40\uBA85\uC120", department: "Elementary Math Team Leader", departmentKo: "\uCD08\uB4F1\uC218\uD559\uD300\uC7A5", bio: "Elementary math curriculum specialist with a focus on foundational skills.", bioKo: "\uAE30\uCD08 \uB2A5\uB825\uC5D0 \uC911\uC810\uC744 \uB454 \uCD08\uB4F1 \uC218\uD559 \uAD50\uC721\uACFC\uC815 \uC804\uBB38\uAC00", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 3, name: "Lee Min-kyung", nameKo: "\uC774\uBBFC\uACBD", department: "Math Teacher", departmentKo: "\uC218\uD559\uACFC\uAC15\uC0AC", bio: "Specialized in mathematics instruction for students of all levels.", bioKo: "\uBAA8\uB4E0 \uC218\uC900\uC758 \uD559\uC0DD\uB4E4\uC744 \uC704\uD55C \uC218\uD559 \uAD50\uC721 \uC804\uBB38\uAC00", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 4, name: "Kim Sun-jung", nameKo: "\uAE40\uC120\uC815", department: "Math Teacher", departmentKo: "\uC218\uD559\uACFC\uAC15\uC0AC", bio: "Experienced mathematics instructor with a student-centered approach.", bioKo: "\uD559\uC0DD \uC911\uC2EC \uC811\uADFC\uBC95\uC744 \uAC00\uC9C4 \uACBD\uD5D8 \uB9CE\uC740 \uC218\uD559 \uAC15\uC0AC", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 5, name: "Kim Ji-yeon", nameKo: "\uAE40\uC9C0\uC5F0", department: "Math Teacher", departmentKo: "\uC218\uD559\uACFC\uAC15\uC0AC", bio: "Dedicated to making mathematics accessible and enjoyable for all students.", bioKo: "\uBAA8\uB4E0 \uD559\uC0DD\uB4E4\uC774 \uC218\uD559\uC744 \uC27D\uACE0 \uC990\uAC81\uAC8C \uBC30\uC6B8 \uC218 \uC788\uB3C4\uB85D \uB178\uB825\uD558\uB294 \uAC15\uC0AC", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 6, name: "Jung Su-kyung", nameKo: "\uC815\uC218\uACBD", department: "Math Teacher", departmentKo: "\uC218\uD559\uACFC\uAC15\uC0AC", bio: "Mathematics instructor with a passion for helping students discover the beauty of math.", bioKo: "\uD559\uC0DD\uB4E4\uC774 \uC218\uD559\uC758 \uC544\uB984\uB2E4\uC6C0\uC744 \uBC1C\uACAC\uD558\uB3C4\uB85D \uB3D5\uB294 \uC5F4\uC815\uC744 \uAC00\uC9C4 \uC218\uD559 \uAC15\uC0AC", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        { id: 7, name: "Jung Hye-ah", nameKo: "\uC815\uD61C\uC544", department: "Math Teacher", departmentKo: "\uC218\uD559\uACFC\uAC15\uC0AC", bio: "Mathematics educator focused on developing critical thinking skills.", bioKo: "\uBE44\uD310\uC801 \uC0AC\uACE0\uB825 \uAC1C\uBC1C\uC5D0 \uC911\uC810\uC744 \uB454 \uC218\uD559 \uAD50\uC721\uC790", imageUrl: "/assets/lumen_logo.jpg", email: null, linkedin: null, academyType: "lumen" },
        // 영어 선생님들 - 영어 이름으로 표시
        { id: 8, name: "Olivia", nameKo: "Olivia", department: "English Teacher", departmentKo: "\uC601\uC5B4 \uD2F0\uCC98", bio: "English language instructor with experience teaching young learners.", bioKo: "\uC5B4\uB9B0 \uD559\uC2B5\uC790\uB4E4\uC744 \uAC00\uB974\uCE5C \uACBD\uD5D8\uC774 \uC788\uB294 \uC601\uC5B4 \uAC15\uC0AC", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        { id: 9, name: "Elly", nameKo: "Elly", department: "English Teacher", departmentKo: "\uC601\uC5B4 \uD2F0\uCC98", bio: "Specializes in creative teaching methods for elementary students.", bioKo: "\uCD08\uB4F1\uD559\uC0DD\uC744 \uC704\uD55C \uCC3D\uC758\uC801\uC778 \uAD50\uC721 \uBC29\uBC95 \uC804\uBB38\uAC00", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        { id: 10, name: "Laura", nameKo: "Laura", department: "English Teacher", departmentKo: "\uC601\uC5B4 \uD2F0\uCC98", bio: "Experienced in developing language fluency through interactive activities.", bioKo: "\uC0C1\uD638\uC791\uC6A9 \uD65C\uB3D9\uC744 \uD1B5\uD55C \uC5B8\uC5B4 \uC720\uCC3D\uC131 \uAC1C\uBC1C\uC5D0 \uACBD\uD5D8\uC774 \uD48D\uBD80\uD55C \uAD50\uC0AC", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        { id: 11, name: "Grace", nameKo: "Grace", department: "Elementary English Team Leader", departmentKo: "\uCD08\uB4F1\uC5B4\uD559\uC6D0\uD300\uC7A5", bio: "Elementary English curriculum developer with a focus on communicative approach.", bioKo: "\uC758\uC0AC\uC18C\uD1B5 \uC811\uADFC\uBC95\uC5D0 \uC911\uC810\uC744 \uB454 \uCD08\uB4F1 \uC601\uC5B4 \uAD50\uC721\uACFC\uC815 \uAC1C\uBC1C\uC790", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        { id: 12, name: "Anna", nameKo: "Anna", department: "Native English Teacher", departmentKo: "\uC6D0\uC5B4\uBBFC \uD2F0\uCC98", bio: "Native English speaker dedicated to authentic language instruction.", bioKo: "\uC9C4\uC815\uD55C \uC5B8\uC5B4 \uAD50\uC721\uC5D0 \uC804\uB150\uD558\uB294 \uC601\uC5B4 \uC6D0\uC5B4\uBBFC \uAD50\uC0AC", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        { id: 13, name: "Um Ye-bin", nameKo: "\uC5C4\uC608\uBE48", department: "Media Lab Director", departmentKo: "\uBBF8\uB514\uC5B4\uC2E4\uC7A5", bio: "Specializes in incorporating technology and media into language education.", bioKo: "\uAE30\uC220\uACFC \uBBF8\uB514\uC5B4\uB97C \uC5B8\uC5B4 \uAD50\uC721\uC5D0 \uC811\uBAA9\uD558\uB294 \uC804\uBB38\uAC00", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_elementary" },
        // 다른 교직원 추가
        { id: 20, name: "Kim Dong-hwan", nameKo: "\uAE40\uB3D9\uD658", department: "Korean Literature Teacher", departmentKo: "\uAD6D\uC5B4\uACFC\uAC15\uC0AC", bio: "Korean literature specialist focusing on college entrance exam preparation.", bioKo: "\uB300\uD559 \uC785\uC2DC \uC900\uBE44\uC5D0 \uC911\uC810\uC744 \uB454 \uD55C\uAD6D\uBB38\uD559 \uC804\uBB38\uAC00", imageUrl: "/assets/gratia_logo.jpg", email: null, linkedin: null, academyType: "gratia_college" }
      ];
      const academyType = validateAcademyType(req.query.academyType);
      const result = academyType ? faculty2.filter((f) => f.academyType === academyType) : faculty2;
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty data" });
    }
  });
  app2.get("/api/faculty/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid faculty ID" });
      }
      const faculty2 = await storage.getFacultyById(id);
      if (!faculty2) {
        return res.status(404).json({ message: "Faculty member not found" });
      }
      res.json(faculty2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty data" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const courses2 = [
        // 루멘 수학과학 과정들
        { id: 1, title: "Elementary Math Individual Program", titleKo: "\uCD08\uB4F1\uBD80\uC218\uD559 \uAC1C\uC778\uBCC4\uB9DE\uCDA4", description: "Personalized elementary math program tailored to each student", descriptionKo: "\uAC01 \uD559\uC0DD\uC5D0\uAC8C \uB9DE\uCDA4\uD654\uB41C \uCD08\uB4F1\uC218\uD559 \uAC1C\uC778\uBCC4 \uD504\uB85C\uADF8\uB7A8", category: "elementary", categoryKo: "\uCD08\uB4F1", price: "150,000\uC6D0/\uC6D4", priceKo: "150,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 2, title: "Middle School Math Theos Program", titleKo: "\uC911\uB4F1\uBD80\uC218\uD559 \uD2F0\uC624\uC2A4\uD504\uB85C\uADF8\uB7A8", description: "Advanced Theos program for middle school mathematics", descriptionKo: "\uC911\uB4F1\uC218\uD559\uC744 \uC704\uD55C \uACE0\uAE09 \uD2F0\uC624\uC2A4 \uD504\uB85C\uADF8\uB7A8", category: "middle", categoryKo: "\uC911\uB4F1", price: "180,000\uC6D0/\uC6D4", priceKo: "180,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 3, title: "High School Math Academic/CSAT", titleKo: "\uACE0\uB4F1\uBD80\uC218\uD559 \uB0B4\uC2E0\uC9D1\uC911\uAD00\uB9AC/\uC218\uB2A5\uB300\uBE44", description: "High school math academic performance and CSAT preparation", descriptionKo: "\uACE0\uB4F1\uC218\uD559 \uB0B4\uC2E0 \uC9D1\uC911 \uAD00\uB9AC \uBC0F \uC218\uB2A5 \uB300\uBE44", category: "high", categoryKo: "\uACE0\uB4F1", price: "220,000\uC6D0/\uC6D4", priceKo: "220,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 4, title: "Middle School Science Academic/Special", titleKo: "\uC911\uB4F1\uBD80\uACFC\uD559 \uB0B4\uC2E0\uBC18/\uD2B9\uBAA9\uBC18", description: "Middle school science academic and specialized school preparation", descriptionKo: "\uC911\uB4F1\uACFC\uD559 \uB0B4\uC2E0\uBC18 \uBC0F \uD2B9\uBAA9\uACE0 \uB300\uBE44\uBC18", category: "science", categoryKo: "\uACFC\uD559", price: "160,000\uC6D0/\uC6D4", priceKo: "160,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 5, title: "High School Science Academic/CSAT", titleKo: "\uACE0\uB4F1\uBD80\uACFC\uD559 \uB0B4\uC2E0\uC9D1\uC911\uBC18/\uC218\uB2A5\uB300\uBE44", description: "High school science academic performance and CSAT preparation", descriptionKo: "\uACE0\uB4F1\uACFC\uD559 \uB0B4\uC2E0 \uC9D1\uC911\uBC18 \uBC0F \uC218\uB2A5 \uB300\uBE44", category: "science", categoryKo: "\uACFC\uD559", price: "200,000\uC6D0/\uC6D4", priceKo: "200,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        // 그라티아 초등 영어 과정들
        { id: 6, title: "Elementary English Foundations", titleKo: "\uCD08\uB4F1\uC601\uC5B4 \uAE30\uCD08", description: "Building strong English foundation for young learners", descriptionKo: "\uC5B4\uB9B0 \uD559\uC2B5\uC790\uB4E4\uC744 \uC704\uD55C \uD0C4\uD0C4\uD55C \uC601\uC5B4 \uAE30\uCD08 \uAD6C\uCD95", category: "elementary", categoryKo: "\uCD08\uB4F1", price: "160,000\uC6D0/\uC6D4", priceKo: "160,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 7, title: "Interactive English Speaking", titleKo: "\uC601\uC5B4 \uD68C\uD654 \uC9D1\uC911", description: "Focused speaking practice with native teachers", descriptionKo: "\uC6D0\uC5B4\uBBFC \uAD50\uC0AC\uC640 \uD568\uAED8\uD558\uB294 \uC9D1\uC911 \uD68C\uD654 \uC5F0\uC2B5", category: "speaking", categoryKo: "\uD68C\uD654", price: "180,000\uC6D0/\uC6D4", priceKo: "180,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 60\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 60\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 8, title: "Reading & Writing Skills", titleKo: "\uC601\uC5B4 \uC77D\uAE30\xB7\uC4F0\uAE30", description: "Comprehensive reading and writing skill development", descriptionKo: "\uC885\uD569\uC801\uC778 \uC77D\uAE30\xB7\uC4F0\uAE30 \uC2E4\uB825 \uD5A5\uC0C1", category: "literacy", categoryKo: "\uBB38\uD574\uB825", price: "140,000\uC6D0/\uC6D4", priceKo: "140,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 9, title: "Media English Lab", titleKo: "\uBBF8\uB514\uC5B4 \uC601\uC5B4\uC2E4", description: "Technology-enhanced English learning experience", descriptionKo: "\uAE30\uC220\uC744 \uD65C\uC6A9\uD55C \uC601\uC5B4 \uD559\uC2B5 \uACBD\uD5D8", category: "media", categoryKo: "\uBBF8\uB514\uC5B4", price: "170,000\uC6D0/\uC6D4", priceKo: "170,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        // 그라티아 입시관 과정들
        { id: 10, title: "Middle School Academic Performance", titleKo: "\uC911\uB4F1\uBD80 \uB0B4\uC2E0\uC9D1\uC911\uBC18", description: "Intensive academic performance improvement for middle school students", descriptionKo: "\uC911\uD559\uC0DD\uC744 \uC704\uD55C \uC9D1\uC911\uC801\uC778 \uB0B4\uC2E0 \uC131\uC801 \uD5A5\uC0C1 \uD504\uB85C\uADF8\uB7A8", category: "academic", categoryKo: "\uB0B4\uC2E0", price: "200,000\uC6D0/\uC6D4", priceKo: "200,000\uC6D0/\uC6D4", duration: "\uC8FC 4\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 4\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uB4F1", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 11, title: "Middle School CSAT Foundation", titleKo: "\uC911\uB4F1\uBD80 \uC218\uB2A5\uAE30\uCD08\uBC18", description: "Building foundation for college entrance exam preparation", descriptionKo: "\uB300\uD559 \uC785\uC2DC\uB97C \uC704\uD55C \uC218\uB2A5 \uAE30\uCD08 \uC2E4\uB825 \uAD6C\uCD95", category: "foundation", categoryKo: "\uAE30\uCD08", price: "180,000\uC6D0/\uC6D4", priceKo: "180,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uB4F1", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 12, title: "High School Academic Performance", titleKo: "\uACE0\uB4F1\uBD80 \uB0B4\uC2E0\uC9D1\uC911\uBC18", description: "Intensive academic performance improvement for high school students", descriptionKo: "\uACE0\uB4F1\uD559\uC0DD\uC744 \uC704\uD55C \uC9D1\uC911\uC801\uC778 \uB0B4\uC2E0 \uC131\uC801 \uD5A5\uC0C1 \uD504\uB85C\uADF8\uB7A8", category: "academic", categoryKo: "\uB0B4\uC2E0", price: "250,000\uC6D0/\uC6D4", priceKo: "250,000\uC6D0/\uC6D4", duration: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 13, title: "High School CSAT Advanced", titleKo: "\uACE0\uB4F1\uBD80 \uC218\uB2A5\uC2EC\uD654\uBC18", description: "Advanced preparation for college entrance examination", descriptionKo: "\uB300\uD559 \uC785\uC2DC\uB97C \uC704\uD55C \uC218\uB2A5 \uC2EC\uD654 \uB300\uBE44 \uACFC\uC815", category: "advanced", categoryKo: "\uC2EC\uD654", price: "280,000\uC6D0/\uC6D4", priceKo: "280,000\uC6D0/\uC6D4", duration: "\uC8FC 5\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 5\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" }
      ];
      const category = req.query.category;
      const academyType = validateAcademyType(req.query.academyType);
      let result = courses2;
      if (academyType) {
        result = result.filter((course) => course.academyType === academyType);
      }
      if (category) {
        result = result.filter((course) => course.category === category);
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses data" });
    }
  });
  app2.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      const courses2 = [
        // 루멘 수학과학 과정들
        { id: 1, title: "Elementary Math Individual Program", titleKo: "\uCD08\uB4F1\uBD80\uC218\uD559 \uAC1C\uC778\uBCC4\uB9DE\uCDA4", description: "Personalized elementary math program tailored to each student", descriptionKo: "\uAC01 \uD559\uC0DD\uC5D0\uAC8C \uB9DE\uCDA4\uD654\uB41C \uCD08\uB4F1\uC218\uD559 \uAC1C\uC778\uBCC4 \uD504\uB85C\uADF8\uB7A8", category: "elementary", categoryKo: "\uCD08\uB4F1", price: "150,000\uC6D0/\uC6D4", priceKo: "150,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 2, title: "Middle School Math Theos Program", titleKo: "\uC911\uB4F1\uBD80\uC218\uD559 \uD2F0\uC624\uC2A4\uD504\uB85C\uADF8\uB7A8", description: "Advanced Theos program for middle school mathematics", descriptionKo: "\uC911\uB4F1\uC218\uD559\uC744 \uC704\uD55C \uACE0\uAE09 \uD2F0\uC624\uC2A4 \uD504\uB85C\uADF8\uB7A8", category: "middle", categoryKo: "\uC911\uB4F1", price: "180,000\uC6D0/\uC6D4", priceKo: "180,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 3, title: "High School Math Academic/CSAT", titleKo: "\uACE0\uB4F1\uBD80\uC218\uD559 \uB0B4\uC2E0\uC9D1\uC911\uAD00\uB9AC/\uC218\uB2A5\uB300\uBE44", description: "High school math academic performance and CSAT preparation", descriptionKo: "\uACE0\uB4F1\uC218\uD559 \uB0B4\uC2E0 \uC9D1\uC911 \uAD00\uB9AC \uBC0F \uC218\uB2A5 \uB300\uBE44", category: "high", categoryKo: "\uACE0\uB4F1", price: "220,000\uC6D0/\uC6D4", priceKo: "220,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 4, title: "Middle School Science Academic/Special", titleKo: "\uC911\uB4F1\uBD80\uACFC\uD559 \uB0B4\uC2E0\uBC18/\uD2B9\uBAA9\uBC18", description: "Middle school science academic and specialized school preparation", descriptionKo: "\uC911\uB4F1\uACFC\uD559 \uB0B4\uC2E0\uBC18 \uBC0F \uD2B9\uBAA9\uACE0 \uB300\uBE44\uBC18", category: "science", categoryKo: "\uACFC\uD559", price: "160,000\uC6D0/\uC6D4", priceKo: "160,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        { id: 5, title: "High School Science Academic/CSAT", titleKo: "\uACE0\uB4F1\uBD80\uACFC\uD559 \uB0B4\uC2E0\uC9D1\uC911\uBC18/\uC218\uB2A5\uB300\uBE44", description: "High school science academic performance and CSAT preparation", descriptionKo: "\uACE0\uB4F1\uACFC\uD559 \uB0B4\uC2E0 \uC9D1\uC911\uBC18 \uBC0F \uC218\uB2A5 \uB300\uBE44", category: "science", categoryKo: "\uACFC\uD559", price: "200,000\uC6D0/\uC6D4", priceKo: "200,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 120\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "lumen", imageUrl: "/assets/lumen_logo.jpg" },
        // 그라티아 초등 영어 과정들
        { id: 6, title: "Elementary English Foundations", titleKo: "\uCD08\uB4F1\uC601\uC5B4 \uAE30\uCD08", description: "Building strong English foundation for young learners", descriptionKo: "\uC5B4\uB9B0 \uD559\uC2B5\uC790\uB4E4\uC744 \uC704\uD55C \uD0C4\uD0C4\uD55C \uC601\uC5B4 \uAE30\uCD08 \uAD6C\uCD95", category: "elementary", categoryKo: "\uCD08\uB4F1", price: "160,000\uC6D0/\uC6D4", priceKo: "160,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 7, title: "Interactive English Speaking", titleKo: "\uC601\uC5B4 \uD68C\uD654 \uC9D1\uC911", description: "Focused speaking practice with native teachers", descriptionKo: "\uC6D0\uC5B4\uBBFC \uAD50\uC0AC\uC640 \uD568\uAED8\uD558\uB294 \uC9D1\uC911 \uD68C\uD654 \uC5F0\uC2B5", category: "speaking", categoryKo: "\uD68C\uD654", price: "180,000\uC6D0/\uC6D4", priceKo: "180,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 60\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 60\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 8, title: "Reading & Writing Skills", titleKo: "\uC601\uC5B4 \uC77D\uAE30\xB7\uC4F0\uAE30", description: "Comprehensive reading and writing skill development", descriptionKo: "\uC885\uD569\uC801\uC778 \uC77D\uAE30\xB7\uC4F0\uAE30 \uC2E4\uB825 \uD5A5\uC0C1", category: "literacy", categoryKo: "\uBB38\uD574\uB825", price: "140,000\uC6D0/\uC6D4", priceKo: "140,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 9, title: "Media English Lab", titleKo: "\uBBF8\uB514\uC5B4 \uC601\uC5B4\uC2E4", description: "Technology-enhanced English learning experience", descriptionKo: "\uAE30\uC220\uC744 \uD65C\uC6A9\uD55C \uC601\uC5B4 \uD559\uC2B5 \uACBD\uD5D8", category: "media", categoryKo: "\uBBF8\uB514\uC5B4", price: "170,000\uC6D0/\uC6D4", priceKo: "170,000\uC6D0/\uC6D4", duration: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", durationKo: "\uC8FC 2\uD68C, \uD68C\uB2F9 90\uBD84", level: "Elementary", levelKo: "\uCD08\uB4F1", academyType: "gratia_elementary", imageUrl: "/assets/gratia_logo.jpg" },
        // 그라티아 입시관 과정들
        { id: 10, title: "Middle School Academic Performance", titleKo: "\uC911\uB4F1\uBD80 \uB0B4\uC2E0\uC9D1\uC911\uBC18", description: "Intensive academic performance program for middle school students", descriptionKo: "\uC911\uD559\uC0DD\uC744 \uC704\uD55C \uB0B4\uC2E0 \uC9D1\uC911 \uAD00\uB9AC \uD504\uB85C\uADF8\uB7A8", category: "academic", categoryKo: "\uB0B4\uC2E0", price: "200,000\uC6D0/\uC6D4", priceKo: "200,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 11, title: "Middle School CSAT Foundation", titleKo: "\uC911\uB4F1\uBD80 \uC218\uB2A5\uAE30\uCD08\uBC18", description: "Foundation program for CSAT preparation starting from middle school", descriptionKo: "\uC911\uD559\uAD50\uBD80\uD130 \uC2DC\uC791\uD558\uB294 \uC218\uB2A5 \uAE30\uCD08 \uB300\uBE44 \uD504\uB85C\uADF8\uB7A8", category: "foundation", categoryKo: "\uAE30\uCD08", price: "220,000\uC6D0/\uC6D4", priceKo: "220,000\uC6D0/\uC6D4", duration: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", durationKo: "\uC8FC 3\uD68C, \uD68C\uB2F9 120\uBD84", level: "Middle School", levelKo: "\uC911\uD559\uAD50", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 12, title: "High School Academic Performance", titleKo: "\uACE0\uB4F1\uBD80 \uB0B4\uC2E0\uC9D1\uC911\uBC18", description: "Intensive academic performance program for high school students", descriptionKo: "\uACE0\uB4F1\uD559\uC0DD\uC744 \uC704\uD55C \uB0B4\uC2E0 \uC9D1\uC911 \uAD00\uB9AC \uD504\uB85C\uADF8\uB7A8", category: "academic", categoryKo: "\uB0B4\uC2E0", price: "250,000\uC6D0/\uC6D4", priceKo: "250,000\uC6D0/\uC6D4", duration: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" },
        { id: 13, title: "High School Advanced CSAT", titleKo: "\uACE0\uB4F1\uBD80 \uC218\uB2A5\uC2EC\uD654\uBC18", description: "Advanced CSAT preparation program for high school students", descriptionKo: "\uACE0\uB4F1\uD559\uC0DD\uC744 \uC704\uD55C \uC218\uB2A5 \uC2EC\uD654 \uB300\uBE44 \uD504\uB85C\uADF8\uB7A8", category: "advanced", categoryKo: "\uC2EC\uD654", price: "280,000\uC6D0/\uC6D4", priceKo: "280,000\uC6D0/\uC6D4", duration: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", durationKo: "\uC8FC 4\uD68C, \uD68C\uB2F9 150\uBD84", level: "High School", levelKo: "\uACE0\uB4F1\uD559\uAD50", academyType: "gratia_college", imageUrl: "/assets/gratia_logo.jpg" }
      ];
      const course = courses2.find((c) => c.id === id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course data" });
    }
  });
  app2.get("/api/gallery", async (req, res) => {
    try {
      const gallery2 = [
        { id: 1, title: "Modern Classroom Environment", titleKo: "\uD604\uB300\uC801\uC778 \uAD50\uC2E4 \uD658\uACBD", description: "Our state-of-the-art classrooms equipped with the latest technology", descriptionKo: "\uCD5C\uC2E0 \uAE30\uC220\uC774 \uC801\uC6A9\uB41C \uCD5C\uCCA8\uB2E8 \uAD50\uC2E4", imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500&h=300&fit=crop", academyType: "lumen" },
        { id: 2, title: "Interactive Learning Sessions", titleKo: "\uC0C1\uD638\uC791\uC6A9 \uD559\uC2B5 \uC138\uC158", description: "Students engaging in collaborative problem-solving activities", descriptionKo: "\uD559\uC0DD\uB4E4\uC774 \uD611\uB825\uC801 \uBB38\uC81C \uD574\uACB0 \uD65C\uB3D9\uC5D0 \uCC38\uC5EC\uD558\uB294 \uBAA8\uC2B5", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop", academyType: "lumen" },
        { id: 3, title: "Study Hall", titleKo: "\uC790\uC2B5\uC2E4", description: "Quiet study spaces for focused individual learning", descriptionKo: "\uC9D1\uC911\uC801\uC778 \uAC1C\uBCC4 \uD559\uC2B5\uC744 \uC704\uD55C \uC870\uC6A9\uD55C \uC790\uC2B5 \uACF5\uAC04", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop", academyType: "lumen" },
        { id: 4, title: "English Language Lab", titleKo: "\uC601\uC5B4 \uC5B8\uC5B4 \uC2E4\uC2B5\uC2E4", description: "Dedicated space for English conversation practice", descriptionKo: "\uC601\uC5B4 \uD68C\uD654 \uC5F0\uC2B5\uC744 \uC704\uD55C \uC804\uC6A9 \uACF5\uAC04", imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&h=300&fit=crop", academyType: "gratia_elementary" },
        { id: 5, title: "Media Language Lab", titleKo: "\uBBF8\uB514\uC5B4 \uC5B8\uC5B4\uC2E4", description: "Technology-enhanced language learning environment", descriptionKo: "\uAE30\uC220\uC774 \uC811\uBAA9\uB41C \uC5B8\uC5B4 \uD559\uC2B5 \uD658\uACBD", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop", academyType: "gratia_elementary" },
        { id: 6, title: "Student Presentations", titleKo: "\uD559\uC0DD \uBC1C\uD45C", description: "Students showcasing their projects and achievements", descriptionKo: "\uD559\uC0DD\uB4E4\uC774 \uC790\uC2E0\uC758 \uD504\uB85C\uC81D\uD2B8\uC640 \uC131\uCDE8\uB97C \uBC1C\uD45C\uD558\uB294 \uBAA8\uC2B5", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop", academyType: "gratia_college" },
        { id: 7, title: "Science Laboratory", titleKo: "\uACFC\uD559 \uC2E4\uD5D8\uC2E4", description: "Well-equipped laboratory for hands-on science experiments", descriptionKo: "\uCCB4\uD5D8\uD615 \uACFC\uD559 \uC2E4\uD5D8\uC744 \uC704\uD55C \uC644\uBE44\uB41C \uC2E4\uD5D8\uC2E4", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=300&fit=crop", academyType: "lumen" },
        { id: 8, title: "Individual Study Spaces", titleKo: "\uAC1C\uBCC4 \uD559\uC2B5 \uACF5\uAC04", description: "Quiet individual study booths for concentrated learning", descriptionKo: "\uC9D1\uC911 \uD559\uC2B5\uC744 \uC704\uD55C \uC870\uC6A9\uD55C \uAC1C\uBCC4 \uC2A4\uD130\uB514 \uBD80\uC2A4", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop", academyType: "lumen" },
        { id: 9, title: "Group Discussion Area", titleKo: "\uADF8\uB8F9 \uD1A0\uB860 \uACF5\uAC04", description: "Collaborative learning space for group discussions", descriptionKo: "\uADF8\uB8F9 \uD1A0\uB860\uC744 \uC704\uD55C \uD611\uB825 \uD559\uC2B5 \uACF5\uAC04", imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&h=300&fit=crop", academyType: "gratia_elementary" },
        { id: 10, title: "Reading Corner", titleKo: "\uB3C5\uC11C \uCF54\uB108", description: "Comfortable reading area with extensive book collection", descriptionKo: "\uD48D\uBD80\uD55C \uB3C4\uC11C \uCEEC\uB809\uC158\uC774 \uC788\uB294 \uD3B8\uC548\uD55C \uB3C5\uC11C \uACF5\uAC04", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop", academyType: "gratia_elementary" },
        { id: 11, title: "College Prep Study Room", titleKo: "\uB300\uC785 \uC900\uBE44\uC2E4", description: "Specialized study room for college entrance exam preparation", descriptionKo: "\uB300\uD559 \uC785\uC2DC \uC900\uBE44\uB97C \uC704\uD55C \uC804\uC6A9 \uC2A4\uD130\uB514\uB8F8", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop", academyType: "gratia_college" }
      ];
      const academyType = validateAcademyType(req.query.academyType);
      const result = academyType ? gallery2.filter((item) => item.academyType === academyType) : gallery2;
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery data" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const news2 = [
        { id: 1, title: "2025 Education Policy Changes", titleKo: "2025\uB144 \uAD50\uC721\uC815\uCC45 \uBCC0\uD654", content: "Major changes in Korean education policy for the new academic year announced by Ministry of Education.", contentKo: "\uAD50\uC721\uBD80\uC5D0\uC11C \uC0C8 \uD559\uB144\uB3C4 \uD55C\uAD6D \uAD50\uC721\uC815\uCC45\uC758 \uC8FC\uC694 \uBCC0\uD654\uB97C \uBC1C\uD45C\uD588\uC2B5\uB2C8\uB2E4.", date: "2025-01-20", academyType: "lumen", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop" },
        { id: 2, title: "AI Integration in Korean Classrooms", titleKo: "\uD55C\uAD6D \uAD50\uC2E4\uC5D0\uC11C\uC758 AI \uD65C\uC6A9", content: "Schools across Korea are implementing AI-powered learning tools to enhance student education.", contentKo: "\uC804\uAD6D \uD559\uAD50\uB4E4\uC774 \uD559\uC0DD \uAD50\uC721 \uD5A5\uC0C1\uC744 \uC704\uD574 AI \uAE30\uBC18 \uD559\uC2B5 \uB3C4\uAD6C\uB97C \uB3C4\uC785\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.", date: "2025-01-18", academyType: "lumen", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop" },
        { id: 3, title: "International Students in Korea Rise", titleKo: "\uD55C\uAD6D \uC720\uD559\uC0DD \uC218 \uC99D\uAC00", content: "Record number of international students choosing Korea for their educational journey.", contentKo: "\uAD50\uC721 \uC5EC\uC815\uC744 \uC704\uD574 \uD55C\uAD6D\uC744 \uC120\uD0DD\uD558\uB294 \uC720\uD559\uC0DD \uC218\uAC00 \uAE30\uB85D\uC801\uC73C\uB85C \uC99D\uAC00\uD588\uC2B5\uB2C8\uB2E4.", date: "2025-01-15", academyType: "gratia_elementary", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500&auto=format&fit=crop" },
        { id: 4, title: "STEM Education Funding Increase", titleKo: "STEM \uAD50\uC721 \uC608\uC0B0 \uC99D\uAC00", content: "Government announces significant budget increase for science, technology, engineering, and math education.", contentKo: "\uC815\uBD80\uAC00 \uACFC\uD559, \uAE30\uC220, \uACF5\uD559, \uC218\uD559 \uAD50\uC721\uC5D0 \uB300\uD55C \uB300\uD3ED\uC801\uC778 \uC608\uC0B0 \uC99D\uC561\uC744 \uBC1C\uD45C\uD588\uC2B5\uB2C8\uB2E4.", date: "2025-01-12", academyType: "lumen", imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=500&auto=format&fit=crop" },
        { id: 5, title: "Digital Literacy Standards Updated", titleKo: "\uB514\uC9C0\uD138 \uB9AC\uD130\uB7EC\uC2DC \uAE30\uC900 \uC5C5\uB370\uC774\uD2B8", content: "New national standards for digital literacy education in elementary and secondary schools.", contentKo: "\uCD08\uC911\uB4F1\uD559\uAD50 \uB514\uC9C0\uD138 \uB9AC\uD130\uB7EC\uC2DC \uAD50\uC721\uC744 \uC704\uD55C \uC0C8\uB85C\uC6B4 \uAD6D\uAC00 \uAE30\uC900\uC774 \uB9C8\uB828\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", date: "2025-01-10", academyType: "gratia_elementary", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop" },
        { id: 6, title: "University Admission Changes for 2026", titleKo: "2026\uB144 \uB300\uD559\uC785\uC2DC \uBCC0\uD654", content: "Significant changes to university entrance examinations and admission criteria announced.", contentKo: "\uB300\uD559\uC785\uD559\uC2DC\uD5D8\uACFC \uC785\uD559 \uAE30\uC900\uC5D0 \uB300\uD55C \uC911\uB300\uD55C \uBCC0\uD654\uAC00 \uBC1C\uD45C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", date: "2025-01-08", academyType: "gratia_college", imageUrl: "https://images.unsplash.com/photo-1606027216976-3b3cfb2d3cf0?q=80&w=500&auto=format&fit=crop" },
        { id: 7, title: "Korean Language Education Global Expansion", titleKo: "\uD55C\uAD6D\uC5B4 \uAD50\uC721 \uAE00\uB85C\uBC8C \uD655\uC0B0", content: "Korean language education programs expanding worldwide with increased international interest.", contentKo: "\uAD6D\uC81C\uC801 \uAD00\uC2EC \uC99D\uAC00\uB85C \uD55C\uAD6D\uC5B4 \uAD50\uC721 \uD504\uB85C\uADF8\uB7A8\uC774 \uC804 \uC138\uACC4\uC801\uC73C\uB85C \uD655\uC0B0\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4.", date: "2025-01-05", academyType: "gratia_elementary", imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=500&auto=format&fit=crop" },
        { id: 8, title: "Mental Health Support in Schools", titleKo: "\uD559\uAD50 \uB0B4 \uC815\uC2E0\uAC74\uAC15 \uC9C0\uC6D0", content: "Enhanced mental health support programs implemented across Korean educational institutions.", contentKo: "\uD55C\uAD6D \uAD50\uC721\uAE30\uAD00\uC5D0\uC11C \uAC15\uD654\uB41C \uC815\uC2E0\uAC74\uAC15 \uC9C0\uC6D0 \uD504\uB85C\uADF8\uB7A8\uC774 \uC2DC\uD589\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4.", date: "2025-01-03", academyType: "gratia_college", imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=500&auto=format&fit=crop" },
        { id: 9, title: "Green Campus Initiatives", titleKo: "\uCE5C\uD658\uACBD \uCEA0\uD37C\uC2A4 \uC774\uB2C8\uC154\uD2F0\uBE0C", content: "Educational institutions adopting sustainable practices and environmental education programs.", contentKo: "\uAD50\uC721\uAE30\uAD00\uC5D0\uC11C \uC9C0\uC18D\uAC00\uB2A5\uD55C \uAD00\uD589\uACFC \uD658\uACBD \uAD50\uC721 \uD504\uB85C\uADF8\uB7A8\uC744 \uB3C4\uC785\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.", date: "2025-01-01", academyType: "lumen", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop" },
        { id: 10, title: "Future Skills Education Framework", titleKo: "\uBBF8\uB798 \uAE30\uC220 \uAD50\uC721 \uD504\uB808\uC784\uC6CC\uD06C", content: "New educational framework focusing on future skills and 21st-century competencies.", contentKo: "\uBBF8\uB798 \uAE30\uC220\uACFC 21\uC138\uAE30 \uC5ED\uB7C9\uC5D0 \uCD08\uC810\uC744 \uB9DE\uCD98 \uC0C8\uB85C\uC6B4 \uAD50\uC721 \uD504\uB808\uC784\uC6CC\uD06C\uAC00 \uB3C4\uC785\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", date: "2024-12-28", academyType: "gratia_college", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop" }
      ];
      const academyType = validateAcademyType(req.query.academyType);
      const result = academyType ? news2.filter((item) => item.academyType === academyType) : news2;
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
var PgSession = connectPgSimple(session);
function setupAuth(app2) {
  app2.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
        // Session table name
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "academy-session-secret",
      // Change in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1e3,
        // 30 days
        secure: process.env.NODE_ENV === "production"
      }
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.authenticateUser(username, password);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  storage.initializeDefaultAdmin().catch(console.error);
}
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.redirect("/admin/login");
}
function setupAuthRoutes(app2) {
  app2.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true, user: req.user });
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
  app2.get("/api/admin/me", isAuthenticated, (req, res) => {
    const { password, ...user } = req.user;
    res.json(user);
  });
}

// server/index.ts
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    await storage.initializeDefaultAdmin();
    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use("/assets", express2.static(path3.join(process.cwd(), "public/assets")));
app.use("/images", express2.static(path3.join(process.cwd(), "public/images")));
setupAuth(app);
setupAuthRoutes(app);
initializeDatabase().catch(console.error);
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
