![AcrossDBX](assets/AcrossDBX.png)

Monitor Databricks clusters across Workspaces

## Features

- **Interactive Cluster Details**: Retrieve detailed information about clusters across a list of specified workspaces.
- **Input Options**: Accepts Environment, Workspace URL, and Token via a form or JSON input.
- **Cluster Highlighting**:
  - Automatically highlights clusters with an auto-termination time greater than **60 minutes**.
  - Auto highlights clusters utilizing **Photon**.
- **Export Functionality**: Easily export results as a **CSV** file for further analysis.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
git clone https://github.com/g-kannan/AcrossDBX.git
docker build -t acrossdbx .
docker run -p 3000:3000 acrossdbx
```

## Usage
1. Input Environment, Workspace URL & Token via Form

    or

2. Click "Swith to JSON" and input details via JSON format 

```json
{
  "url": "https://<workspace1_url>",
  "token": "<token>",
  "environment": "<environment>"
},
{
  "url": "https://<workspace2_url>",
  "token": "<token>",
  "environment": "<environment>"
}
```

## UI
![AcrossDBX](assets/AcrossDBXUI.png)

## Live Demo
[Try Here](https://acrossdbx.vercel.app/)

## License

This project is licensed under the [GPL License](LICENSE).