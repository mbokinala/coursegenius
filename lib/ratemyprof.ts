import axios from 'axios';

interface ProfessorData {
    id: string;
    legacyId: number;
    avgRating: number;
    numRatings: number;
    wouldTakeAgainPercent: number;
    avgDifficulty: number;
    department: string;
    school: {
        name: string;
        id: string;
    };
    firstName: string;
    lastName: string;
    isSaved: boolean;
}

async function fetchProfessorData(schoolName: string, professorName: string): Promise<ProfessorData[] | null> {
    const url = "https://www.ratemyprofessors.com/graphql";
    const headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Basic dGVzdDp0ZXN0", // Replace with your actual authorization if needed
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "ccpa-notice-viewed-02=true; userSchoolId=U2Nob29sLTExMTI=; userSchoolLegacyId=1112; userSchoolName=University%20Of%20Illinois%20at%20Urbana%20-%20Champaign",
        "Referer": `https://www.ratemyprofessors.com/search/professors?q=${encodeURIComponent(professorName)}`,
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    const body = {
        query: `
            query TeacherSearchResultsPageQuery(
              $query: TeacherSearchQuery!
              $schoolID: ID
              $includeSchoolFilter: Boolean!
            ) {
              search: newSearch {
                ...TeacherSearchPagination_search_1ZLmLD
              }
              school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
                __typename
                ... on School {
                  name
                }
                id
              }
            }

            fragment TeacherSearchPagination_search_1ZLmLD on newSearch {
              teachers(query: $query, first: 8, after: "") {
                didFallback
                edges {
                  cursor
                  node {
                    ...TeacherCard_teacher
                    id
                    __typename
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
                resultCount
                filters {
                  field
                  options {
                    value
                    id
                  }
                }
              }
            }

            fragment TeacherCard_teacher on Teacher {
              id
              legacyId
              avgRating
              numRatings
              ...CardFeedback_teacher
              ...CardSchool_teacher
              ...CardName_teacher
              ...TeacherBookmark_teacher
            }

            fragment CardFeedback_teacher on Teacher {
              wouldTakeAgainPercent
              avgDifficulty
            }

            fragment CardSchool_teacher on Teacher {
              department
              school {
                name
                id
              }
            }

            fragment CardName_teacher on Teacher {
              firstName
              lastName
            }

            fragment TeacherBookmark_teacher on Teacher {
              id
              isSaved
            }
        `,
        variables: {
            query: {
                text: professorName,
                schoolID: "U2Nob29sLTExMTI=", // You might need to map schoolName to schoolID properly
                fallback: true,
                departmentID: null
            },
            schoolID: "U2Nob29sLTExMTI=",
            includeSchoolFilter: true
        }
    };

    try {
        const response = await axios.post(url, body, { headers });
        const data = response.data;

        if (data.data && data.data.search && data.data.search.teachers && data.data.search.teachers.edges.length > 0) {
            return data.data.search.teachers.edges.map((edge: any) => edge.node) as ProfessorData[];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching professor data:", error);
        return null;
    }
}

async function main() {
    const schoolName = "University of Illinois at Urbana-Champaign";
    const professorName = "Wade Fagen-Ulmschneider";

    const professors = await fetchProfessorData(schoolName, professorName);

    if (professors) {
        const names = professorName.split(' ');
        const firstName = names[0].toLowerCase();
        const lastName = names.length > 1 ? names[1].toLowerCase() : null;
        const exactMatch = professors.find(prof => 
            prof.firstName.toLowerCase() === firstName &&
            (lastName === null || prof.lastName.toLowerCase() === lastName)
        );
        
        if (exactMatch) {
            console.log(`Exact Match Found:`);
            console.log(`Professor: ${exactMatch.firstName} ${exactMatch.lastName}`);
            console.log(`School: ${exactMatch.school.name}`);
            console.log(`Department: ${exactMatch.department}`);
            console.log(`Overall Rating: ${exactMatch.avgRating}`);
            console.log(`Would Take Again: ${exactMatch.wouldTakeAgainPercent}%`);
            console.log(`Average Difficulty: ${exactMatch.avgDifficulty}`);
            console.log(`Number of Ratings: ${exactMatch.numRatings}`);
        } else {
            console.log(`No exact match found. Here are the top 3 suggestions:`);
            professors.slice(0, 3).forEach((prof, index) => {
                console.log(`Option ${index + 1}:`);
                console.log(`Professor: ${prof.firstName} ${prof.lastName}`);
                console.log(`School: ${prof.school.name}`);
                console.log(`Department: ${prof.department}`);
                console.log(`Overall Rating: ${prof.avgRating}`);
                console.log(`Would Take Again: ${prof.wouldTakeAgainPercent}%`);
                console.log(`Average Difficulty: ${prof.avgDifficulty}`);
                console.log(`Number of Ratings: ${prof.numRatings}`);
                console.log('---');
            });
        }
    } else {
        console.log("No professors found.");
    }
}

main();
