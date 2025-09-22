# Software Engineering Internal - Set 2 Answers
Simple explanations for all questions in the images.

---

## QI. Software Requirement Specification (SRS) - Food Ordering System

**a. Abstract (4M)**
- A Food Ordering System for the cafeteria lets students and faculty order food online, pay digitally, and see real-time order status. Admins can manage the menu and order types (dine-in/take-away).

**b. Functional Requirements (2M)**
- Users can view menu, place orders, and make digital payments.
- Admins can update menu, view orders, and manage food status.

**c. Non-Functional Requirements (2M)**
- The system must be fast and reliable.
- Data security for payments and user info is needed.

**d. Identification of Users (2M)**
- Students, faculty (customers)
- Admin (cafeteria manager)

---

## QII. Maven Web Application Development (30M)

**1. Artifact generated in build (2M)**
- `<finalName>Food-System</finalName>` means the built WAR file will be named `Food-System.war`.
- It is generated in the `target` folder.
- Deploy this WAR in Tomcat's `webapps` folder.

**2. Download repo and list files (2M)**
- Clone: `git clone https://github.com/KumbhamBhargavi75/foodsystem`
- List files: `ls` or `dir` (shows files in folder).

**3. JUnit Dependency (3M)**
- JUnit adds testing support. Maven downloads JUnit and allows running tests in your project.

**4. Misspelling <artifactId> (2M)**
- Maven will throw a build error: "Unknown artifact" or XML error.
- Fix: Correct the tag in `pom.xml`.

**5. <packlize> tag instead of <packaging> (2M)**
- Maven throws an XML parsing error.
- Debug by checking the error message and correcting the tag to `<packaging>`.

**6. Default Maven assumptions (2M)**
- By default, Maven uses `jar` packaging.
- If you want a web app, set `<packaging>war</packaging>`.
- Wrong packaging can make deployment fail.

**7. MySQL connector dependency mistake (3M)**
- Error: Dependency not found.
- Correct coordinates:
  ```xml
  <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.30</version>
  </dependency>
  ```

**8. Tomcat plugin not recognized (3M)**
- Reason: Plugin section might be misplaced or missing `<build>` tag.
- Correct location: Under `<build><plugins>...</plugins></build>`.

**9. <url> tag in pom.xml (3M)**
- Maven accepts the `<url>` tag for project homepage.
- It does not affect the build, just project metadata.

**10. Remove <dependencies> section (2M)**
- If dependencies are removed, project may still build, but required libraries will be missing.
- May cause runtime errors.

**11. Testing issues (2M)**
- Context path in Tomcat will be `/FoodSystem-0.1-SNAPSHOT` if that's the WAR name.
- Output is the deployed web app at that path.

**12. WAR name and URL (3M)**
- If `<finalName>Food-System-vxyz</finalName>`, WAR file is `Food-System-vxyz.war`.
- URL: `localhost:8080/Food-System-vxyz`

**13. SNAPSHOT version (2M)**
- SNAPSHOT means it's a development version, not a stable release.

**14. Java Servlet API Dependency (2M)**
- Add:
  ```xml
  <dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.1</version>
  </dependency>
  ```
  - Place inside `<dependencies>` block in `pom.xml`.

---

## QIII. Git & GitHub Integration with Maven Project (30M)

**1. Initialize Git repo (2M)**
- Command: `git init`

**2. Stage and commit all files (2M)**
- `git add .`
- `git commit -m "Initial commit"`

**3. Push to GitHub (2M)**
- Add remote: `git remote add origin <repo-url>`
- Push: `git push -u origin main`

**4. Add Order Service feature branch (3M)**
- Create branch: `git checkout -b feature-order-service`
- Push branch: `git push -u origin feature-order-service`

**5. Checkout only branch, keep files locally (2M)**
- `git fetch origin feature-order-service`
- `git checkout feature-order-service`

**6. Pull latest changes from remote (2M)**
- `git pull origin main`

**7. Merge feature branch into main (3M)**
- `git checkout main`
- `git merge feature-order-service`
- `git push origin main`

**8. Clone project for teammate (2M)**
- `git clone <repo-url>`

**9. Steps to copy project for teammate (3M)**
- Clone: `git clone <repo-url>`
- Checkout branch: `git checkout feature-order-service`

**10. Push new branch to GitHub (2M)**
- `git push -u origin feature-real-time-status`

**11. Use SSH instead of HTTPS (3M)**
- Generate SSH key: `ssh-keygen`
- Add key to GitHub and use SSH remote URL: `git remote set-url origin git@github.com:<username>/<repo>.git`

**12. Apply patch file and commit (3M)**
- Apply patch: `git apply fix.patch`
- Add: `git add .`
- Commit: `git commit -m "Applied CSS fix from patch"`

---

## QIV. Docker containerization for Maven Application (20M)

**1. Pull nginx image (2M)**
- Command: `docker pull nginx:latest`

**2. Run nginx with custom name and expose port (2M)**
- `docker run --name mynginx -p 8090:80 nginx:latest`

**3. Check host port mapped to container port (2M)**
- Use: `docker ps` and check PORTS column.

**4. High CPU usage in container (2M)**
- Diagnose: `docker stats` to check resource usage.

**5. Stop and remove container (2M)**
- `docker stop <container_id>`
- `docker rm <container_id>`

**6. Expose internal port 5000 on host port 8080 (2M)**
- `docker run -p 8080:5000 <image-name>`

**7. List running containers (2M)**
- `docker ps`

**8. Port conflict solution (2M)**
- Stop conflicting container: `docker stop <container_id>`
- Change port mapping in `docker run` or config.

**9. Rebuild and restart container (2M)**
- `docker build -t <image-name> .`
- `docker run ...` as before.

**10. Check container is running (2M)**
- `docker ps` (shows running containers)

---

## V. Docker Compose (10M)

**1. Write docker-compose.yml for Food Ordering System + PostgreSQL (5M)**
```yaml
version: '3'
services:
  food-ordering-system:
    image: <your-food-ordering-system-image>
    ports:
      - "8080:8080"
    depends_on:
      - db
  db:
    image: postgres:latest
    ports:
      - "7078:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: food_db
```

**2. Pull Maven-built image from Docker Hub (3M)**
- `docker pull <your-dockerhub-username>/<food-ordering-system-image>`

**3. Run PostgreSQL container and insert data (2M)**
- Run: `docker run --name food-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=food_db -p 7078:5432 postgres:latest`
- Insert data: Connect using `psql` or application code and run SQL insert commands.

---

*End of Answers*