import { supabase } from "../utils/supabase";


/**
 * ONE FILE. FINAL VERSION.
 * Calls Supabase Edge Function "gemini-test"
 * Sends student + project JSON
 * Returns RAW TEXT from Gemini
 */
export async function getProjectRanking(
  studentProfile: any,
  projects: any[],
  studentNameOverride?: string
): Promise<string> {
  // -------------------------------
  // 1. Build Student JSON
  // -------------------------------
  // const studentName =
  //   (studentNameOverride && String(studentNameOverride).trim()) ||
  //   `${studentProfile?.given_name || ""} ${studentProfile?.last_name || ""}`.trim() ||
  //   "current student";

  // const currentStudentData = {
  //   name: studentName,
  //   gpa: Number(studentProfile?.gpa) || null,
  //   skills: studentProfile?.skills || [],
  //   skills_text: studentProfile?.skills_text || "",
  //   courses: studentProfile?.courses || [],
  //   hrs_per_week: studentProfile?.hrs_per_week || null,
  //   summary: studentProfile?.summary || "",
  // };

  // // random test 
  const studentName =
    "Daniel";

  const currentStudentData = {
    given_name: "Daniel",
    last_name: "Kumar",
    gpa: 3.51,
    skills: ["SolidWorks", "Python", "3D printing"],
    skills_text: "SolidWorks; Python; 3D printing",
    courses: [
      "Mechanics of Materials",
      "Control Systems",
      "Manufacturing Processes",
    ],
    hrs_per_week: 12,
    summary:
      "Daniel is a Mechanical Engineering student with experience in CAD and robotics, looking for hardware-oriented projects.",
  };

  // -------------------------------
  // 2. Build Project JSON
  // -------------------------------
  const allProjectData = Array.isArray(projects) ? projects.map((p) => ({ ...p })) : [];

  // Log the project order being sent to Gemini (for debugging)
  console.log("📋 Projects order sent to Gemini:");
  allProjectData.forEach((p, idx) => {
    console.log(`  p${idx + 1}: "${p.title || p.name || 'Untitled'}" (id: ${p.id})`);
  });

  // -------------------------------
  // 3. Prompt
  // -------------------------------
  const prompt = 
  `Rank the "current available project" for "${studentName}".
Return ONLY valid JSON in this EXACT format:

[
  { "pid": "p1", "rank": 1 },
  { "pid": "p4", "rank": 2 },
  { "pid": "p2", "rank": 3 },
  { "pid": "p4", "rank": 4 },
  { "pid": "p2", "rank": 5 },
]

must be 5 projects.
Do NOT include explanations.
Do NOT include natural language. 
Only output valid JSON.`;


  console.log("🔥 Sending to gemini-test");
  console.log("Prompt:", prompt);
  console.log("Student JSON:", currentStudentData);
  console.log("Projects JSON size:", JSON.stringify(allProjectData).length);

  // -------------------------------
  // 4. Ensure User Session Exists
  // -------------------------------
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("❌ Session error", sessionError);
    throw new Error("Failed to get session");
  }

  if (!session) {
    throw new Error("No session — user must be logged in.");
  }

  // -------------------------------
  // 5. Call Supabase Edge Function
  // -------------------------------
  const { data, error } = await supabase.functions.invoke("gemini-test", {
    body: {
      prompt,
      current_student_data: currentStudentData,
      all_project_data: allProjectData,
    },

    // ❗❗ IMPORTANT ❗❗
    // DO NOT manually set "Content-Type": "application/json"
    // It breaks on Expo + mobile runtime.
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error("❌ Edge Function Error", error);
    throw new Error("Failed to get ranking from Gemini.");
  }

  console.log("🔥 Gemini Raw Response:", data);

  // data will be raw text because your edge function returns "text/plain"
  if (typeof data !== "string") {
    console.warn("Unexpected response type from edge function:", data);
    return String(data);
  }

  return data;
}

/**
 * Parse ranking response and match with project data
 * Accepts raw string/object and tries multiple shapes:
 * - { rankings: [...] }
 * - [ ... ]
 * - stringified JSON
 */
function tryParseLooseJson(raw: string): any | undefined {
  const attempts = [raw, raw.replace(/,\s*([\]\}])/g, '$1')];
  for (const candidate of attempts) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }
  return undefined;
}

export function parseRankingResponse(
  rankingResponse: any,
  projects: any[]
): Array<{ project: any; rank: number; score?: number; reasoning?: string }> {
  try {
    console.log("🔍 Parsing ranking response. Projects count:", projects.length);
    console.log("🔍 Raw response type:", typeof rankingResponse);
    
    // Log the projects array order (should match the order sent to Gemini)
    console.log("📋 Projects array order for parsing:");
    projects.forEach((p, idx) => {
      console.log(`  [${idx}]: "${p.title || p.name || 'Untitled'}" (id: ${p.id})`);
    });
    
    // 1) Normalize response to object/array
    let normalized: any = rankingResponse;
    if (typeof rankingResponse === "string") {
      normalized = tryParseLooseJson(rankingResponse);

      if (!normalized) {
        // Try to extract JSON array from text
        const match = rankingResponse.match(/\[[\s\S]*\]/);
        if (match) {
          normalized = tryParseLooseJson(match[0]);
        }
      }

      if (!normalized) {
        console.warn("⚠️ Gemini ranking response could not be parsed, using fallback order.");
        normalized = [];
      }
    }

    // 2) Get rankings array from different containers
    let rankings: any[] = [];
    if (Array.isArray(normalized)) {
      rankings = normalized;
    } else if (normalized && Array.isArray(normalized.rankings)) {
      rankings = normalized.rankings;
    } else if (normalized && Array.isArray(normalized.data)) {
      rankings = normalized.data;
    }

    console.log("🔍 Parsed rankings array length:", rankings.length);
    console.log("🔍 First few rankings:", rankings.slice(0, 5));

    if (!Array.isArray(rankings) || rankings.length === 0) {
      console.warn("⚠️ No rankings found, using fallback order");
      // Fallback: return projects in original order
      return projects.map((project, index) => ({
        project,
        rank: index + 1,
      }));
    }

    // 3) Match to projects - PRESERVE THE EXACT ORDER FROM GEMINI
    // Don't sort by rank, keep the order as Gemini returned it
    const matched: Array<{ project: any; rank: number; score?: number; reasoning?: string }> = [];
    
    for (let i = 0; i < rankings.length; i++) {
      const item = rankings[i];
      let project: any = null;

      if (item?.project_id != null) {
        project = projects.find((p) => String(p.id) === String(item.project_id));
        console.log(`🔍 Item ${i}: matched by project_id ${item.project_id}`);
      } else if (item?.pid && /^p\d+$/i.test(String(item.pid))) {
        // pid is 1-indexed: p1 = projects[0], p2 = projects[1], etc.
        const pidNum = parseInt(String(item.pid).replace(/[^0-9]/g, ""), 10);
        const idx = pidNum - 1; // Convert to 0-indexed
        if (idx >= 0 && idx < projects.length) {
          project = projects[idx];
          console.log(`🔍 Item ${i}: pid=${item.pid} (num=${pidNum}) -> projects[${idx}] = "${project?.title || 'NOT FOUND'}"`);
        } else {
          console.warn(`⚠️ Item ${i}: pid=${item.pid} (idx=${idx}) is out of range (projects.length=${projects.length})`);
        }
      } else if (item?.id != null) {
        project = projects.find((p) => String(p.id) === String(item.id));
        console.log(`🔍 Item ${i}: matched by id ${item.id}`);
      }

      if (project) {
        matched.push({
          project,
          rank: Number.isFinite(item?.rank) ? item.rank : i + 1,
          score: typeof item?.score === "number" ? item.score : undefined,
          reasoning: item?.reasoning || item?.explanation || item?.reason || undefined,
        });
      } else {
        console.warn(`⚠️ Item ${i}: Could not match project for item:`, item);
      }
    }

    console.log(`✅ Matched ${matched.length} projects. Order:`, matched.map(m => `#${m.rank} ${m.project?.title}`).join(", "));

    // Return in the EXACT order Gemini provided (already in correct order, no need to sort)
    return matched;
  } catch (e) {
    console.error("❌ parseRankingResponse failed:", e);
    console.warn("⚠️ Returning projects in original order as fallback");
    return projects.map((project, index) => ({
      project,
      rank: index + 1,
    }));
  }
}

/**
 * Convenience helper to call gemini-test and print the raw answer
 * Use this from the frontend to see the Gemini output in Metro terminal.
 */
export async function logGeminiTestAnswer(
  studentProfile: any,
  projects: any[],
  studentNameOverride?: string
): Promise<string> {
  try {
    const answer = await getProjectRanking(studentProfile, projects, studentNameOverride);
    console.log("✅ Gemini Answer (raw):\n", answer);
    return answer;
  } catch (e) {
    console.error("❌ Failed to fetch gemini answer:", e);
    throw e;
  }
}

/**
 * Given a pid like "p3", return the corresponding project's title.
 * The pid numbering is 1-indexed and corresponds to the original projects array order.
 */
export function getProjectTitleByPid(
  projects: any[],
  pidOrId?: string | number | null
): string | null {
  if (!Array.isArray(projects) || pidOrId == null) return null;
  const pidString = String(pidOrId);
  const match = pidString.match(/p(\d+)/i);
  if (match) {
    const index = parseInt(match[1], 10) - 1;
    if (Number.isFinite(index) && index >= 0 && index < projects.length) {
      const project = projects[index];
      return project?.title || project?.name || `Project #${index + 1}`;
    }
  }

  // Fallback to matching by actual project id
  const project = projects.find((p) => String(p.id) === pidString);
  return project?.title || project?.name || null;
}