# <p align="center">**Drive and Deliver Services🚘**
</p>



This repository contains the codebase for Drive and Delivery Services providing both delivery and cab services. The project uses modern technologies including Docker, Kubernetes, TypeScript for backend, React for frontend, GraphQL for API interactions, Redis for caching, Kafka for message brokering, and advanced routing algorithms.


## 📑 For Table of Contents
1. Navigate to the top-right corner of the Readme file.
2. Click on the **list-view**(three horizontal lines and three vertical dots) icon.
3. A dropdown will appear with the Table of Contents.
---

## 📂Project Structure

```
Drive and Delivery Services/
├── frontend/
│ ├── Dockerfile
│ └── src/
├── backend/
│ ├── Dockerfile
│ ├── src/
│ ├── package.json
│ ├── tsconfig.json
│ └── nodemon.json
├── kubernetes/
│ ├── deployment.yaml
│ ├── service.yaml
│ └── ingress.yaml
├── .github/
│ └── workflows/
│ └── ci-cd.yml
├── .dockerignore
├── .gitignore
├── README.md
└── docker-compose.yml
```


## ⚙️CI/CD Pipeline

The CI/CD pipeline is set up using GitHub Actions. It builds and deploys Docker images for the frontend and backend services and deploys them to a Kubernetes cluster.

## 🔗 Setup Instructions

### 📝Prerequisites

- Docker
- Kubernetes
- GitHub account
- DockerHub account

## 🚀 How to Contribute to This Project 🚀

Excited to have you contribute to this project! Follow these simple steps to get started:

1. **🍴 Fork the Repository**  
   - Go to the [repository page](https://github.com/Shivasaireddy007/Drive-and-deliver-services).
   - Click the *Fork* button (top right). This creates a copy of the project in your GitHub account.

2. **💻 Clone Your Fork**  
   - Once the repository is forked, clone it to your local machine. Open your terminal and run:
    ```bash
     git clone https://github.com/your-username/Drive-and-deliver-services.git
    cd Drive-and-deliver-services
    ```

     
   - Replace your-username with your GitHub username.

3. **🌿 Create a New Branch** 
   - Before making any changes, create a new branch for your work:
    ``` bash
     git checkout -b your-branch-name
    ```
     
   - Choose a branch name that describes what you're working on, such as fix-navbar or add-contact-form.

4. **🛠️ Make Your Changes**
   - Open the project files in your code editor (like VS Code) and make your changes.
   - You can contact the project manager for any queiries you have.

5. **✅ Test Your Changes**
   - Make sure your changes work correctly by testing the website locally. Open the index.html file in your browser to see your updates.

6. **💬 Commit Your Changes** 
   - Once your changes are ready, commit them with a descriptive message:
     ```bash
     git add .
     git commit -m "Added feature X or Fixed issue Y"
     ```
     

7. **📤 Push Your Changes**
   - Push your changes to your forked repository on GitHub:
    ``` bash
     git push origin your-branch-name
    ```
     

8. **🔄 Create a Pull Request (PR)** 
   - Go back to the original repository [here](https://github.com/Shivasaireddy007/Drive-and-deliver-services/pulls?q=is%3Aopen+is%3Apr).
   - Click the *Compare & pull request* button.
   - Write a short description of your changes and submit the pull request (PR).

9. **🔎Review Changes**
   - If your changes are approved, your request would be merged.

---

By following these steps, you can easily contribute to this project! If you have any questions, feel free to ask in the repository’s discussion or issue section.


## ✅Run Locally with Docker Compose

```
docker-compose up --build
```


## 🔄Deploy to Kubernetes
```
kubectl apply -f kubernetes/
```
