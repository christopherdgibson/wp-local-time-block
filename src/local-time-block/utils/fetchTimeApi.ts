  interface ZoneSuccess {
    success: true;
    value: number;
  }
  interface ZoneFailure {
    success: false;
    error: string;
  }

  type ZoneResult = ZoneSuccess | ZoneFailure;

export async function fetchTimeApiData(selectedZone: string) : Promise<ZoneResult> {
    const apiUrl = `https://timeapi.io/api/v1/time/current/zone?timezone=${selectedZone}`;
    console.log("apiUrl:", apiUrl);
    //const apiPath = apiUrl;
    const apiPath = `${localTimeBlock.ajaxUrl}?action=api_proxy&url=${apiUrl}`;
    console.log("apiPath", apiPath);

    return fetchWithRetry(apiPath)
      .then((jsondta) => {
        if (jsondta) {
          console.log("jsondta:", jsondta);
          const utcOffsetMinutes = jsondta.utc_offset_seconds / 60;
          return { success: true as const, value: utcOffsetMinutes };
        } else {
          if (jsondta == "Too many requests.") {
            return { success: false as const, error: "Too many requests. Please wait at least 30 seconds." };
          } else {
            return { success: false as const, error: "No data found. Try reloading page." };
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        return { success: false as const, error: "An unexpected error occurred." };
    });
}

  async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, delay = 1000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        console.log("data: ", data);
        if ("success" in data && !data.success) {
          if (
            data.data &&
            data.data.error &&
            data.data.error.includes("cURL error 28")
          ) {
            throw new Error("timeout");
          }
          throw new Error(data.message || "API returned success: false");
        }

        if (!data) {
          if (
            data[0]?.q &&
            data[0]?.q?.includes(
              "Too many requests. Obtain an auth key for unlimited access",
            )
          ) {
            console.log("Too many requests: ", data);
            return "Too many requests.";
          } else {
            console.log("data missing expected structure error:", data);
            throw new Error("API data missing expected structure.");
          }
        }
        return data;
      } catch (error: any) {
        if (
          attempt < retries &&
          (error.message === "timeout" || error.name === "TypeError")
        ) {
          console.log("Trying to fetch again, attempt:", attempt);
          await new Promise((res) => setTimeout(res, delay));
          // retry!
        } else {
          throw error;
        }
      }
    }
  }