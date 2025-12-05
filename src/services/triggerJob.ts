// services/triggerJob.ts

export async function triggerSingleJob(jobName: string, date: string) {
  try {
    // Get userId from localStorage (more reliable than cookie)
    let userId = null;
    try {
      const userMenuStr = localStorage.getItem("userMenu");
      if (userMenuStr) {
        const userMenu = JSON.parse(userMenuStr);
        userId = userMenu[0]?.UserId || null;
      }
    } catch (e) {
      // Silent error
    }
    
    // Fallback to cookie if localStorage fails
    if (!userId) {
      const cookies = document.cookie.split(';');
      const userIdCookie = cookies.find(c => c.trim().startsWith('userId_client='));
      userId = userIdCookie?.split('=')[1]?.trim() || null;
    }

    const res = await fetch("http://10.125.22.11:8080/api/admin/trigger-job", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-User-ID": userId || "",
      },
      body: JSON.stringify({ job_name: jobName, date }),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    return { status: "error", message: "Failed to trigger job", data: null };
  }
}

export async function triggerAllJobs(date: string) {
  try {
    // Get userId from localStorage (more reliable than cookie)
    let userId = null;
    try {
      const userMenuStr = localStorage.getItem("userMenu");
      if (userMenuStr) {
        const userMenu = JSON.parse(userMenuStr);
        userId = userMenu[0]?.UserId || null;
      }
    } catch (e) {
      // Silent error
    }
    
    // Fallback to cookie if localStorage fails
    if (!userId) {
      const cookies = document.cookie.split(';');
      const userIdCookie = cookies.find(c => c.trim().startsWith('userId_client='));
      userId = userIdCookie?.split('=')[1]?.trim() || null;
    }

    const res = await fetch("http://10.125.22.11:8080/api/admin/trigger-all-jobs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-User-ID": userId || "",
      },
      body: JSON.stringify({ date }),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    return { status: "error", message: "Failed to trigger all jobs", data: null };
  }
}

export async function getJobLogs() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/admin/logs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "error", message: "Failed to fetch job logs", data: null };
    }

    const text = await res.text();
    if (!text) {
      return { status: "error", message: "Empty response", data: null };
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return { status: "error", message: "Invalid JSON response", data: null };
    }
  } catch (error) {
    return { status: "error", message: "Failed to fetch job logs", data: null };
  }
}

export async function getJobLogContent(filename: string) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/admin/logs/read", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_name: filename }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "error", message: "Failed to fetch job log content", data: null };
    }

    const text = await res.text();
    if (!text) {
      return { status: "error", message: "Empty response", data: null };
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return { status: "error", message: "Invalid JSON response", data: null };
    }
  } catch (error) {
    return { status: "error", message: "Failed to fetch job log content", data: null };
  }
}

export async function deleteAllJobLogs() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/admin/logs/delete-all", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "error", message: "Failed to delete log files", data: null };
    }

    const text = await res.text();
    if (!text) {
      return { status: "error", message: "Empty response", data: null };
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return { status: "error", message: "Invalid JSON response", data: null };
    }
  } catch (error) {
    return { status: "error", message: "Failed to delete log files", data: null };
  }
}
