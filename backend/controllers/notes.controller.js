export const getSecrets = async (req, res) => {
  try {
    const secrets = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMOAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };
    res.status(200).json(secrets);
  } catch (error) {
    console.error("Error fetching secrets:", error);
    res.status(500).json({ message: "Failed to fetch secrets" });
  }
};
