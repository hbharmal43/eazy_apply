export interface School {
  name: string
  domain: string
  country: string
  state?: string
  city?: string
}

export const schools: School[] = [
  // Top US Universities
  { name: "Harvard University", domain: "harvard.edu", country: "US", state: "Massachusetts", city: "Cambridge" },
  { name: "Stanford University", domain: "stanford.edu", country: "US", state: "California", city: "Stanford" },
  { name: "Massachusetts Institute of Technology", domain: "mit.edu", country: "US", state: "Massachusetts", city: "Cambridge" },
  { name: "University of California, Berkeley", domain: "berkeley.edu", country: "US", state: "California", city: "Berkeley" },
  { name: "University of California, Los Angeles", domain: "ucla.edu", country: "US", state: "California", city: "Los Angeles" },
  { name: "Yale University", domain: "yale.edu", country: "US", state: "Connecticut", city: "New Haven" },
  { name: "Princeton University", domain: "princeton.edu", country: "US", state: "New Jersey", city: "Princeton" },
  { name: "Columbia University", domain: "columbia.edu", country: "US", state: "New York", city: "New York" },
  { name: "University of Chicago", domain: "uchicago.edu", country: "US", state: "Illinois", city: "Chicago" },
  { name: "University of Pennsylvania", domain: "upenn.edu", country: "US", state: "Pennsylvania", city: "Philadelphia" },
  { name: "Cornell University", domain: "cornell.edu", country: "US", state: "New York", city: "Ithaca" },
  { name: "Dartmouth College", domain: "dartmouth.edu", country: "US", state: "New Hampshire", city: "Hanover" },
  { name: "Brown University", domain: "brown.edu", country: "US", state: "Rhode Island", city: "Providence" },
  { name: "Duke University", domain: "duke.edu", country: "US", state: "North Carolina", city: "Durham" },
  { name: "Northwestern University", domain: "northwestern.edu", country: "US", state: "Illinois", city: "Evanston" },
  { name: "Johns Hopkins University", domain: "jhu.edu", country: "US", state: "Maryland", city: "Baltimore" },
  { name: "California Institute of Technology", domain: "caltech.edu", country: "US", state: "California", city: "Pasadena" },
  { name: "Carnegie Mellon University", domain: "cmu.edu", country: "US", state: "Pennsylvania", city: "Pittsburgh" },
  { name: "Vanderbilt University", domain: "vanderbilt.edu", country: "US", state: "Tennessee", city: "Nashville" },
  { name: "Rice University", domain: "rice.edu", country: "US", state: "Texas", city: "Houston" },

  // State Universities
  { name: "University of Michigan", domain: "umich.edu", country: "US", state: "Michigan", city: "Ann Arbor" },
  { name: "University of Virginia", domain: "virginia.edu", country: "US", state: "Virginia", city: "Charlottesville" },
  { name: "University of North Carolina at Chapel Hill", domain: "unc.edu", country: "US", state: "North Carolina", city: "Chapel Hill" },
  { name: "University of Texas at Austin", domain: "utexas.edu", country: "US", state: "Texas", city: "Austin" },
  { name: "University of Texas at Arlington", domain: "uta.edu", country: "US", state: "Texas", city: "Arlington" },
  { name: "University of Texas at Dallas", domain: "utdallas.edu", country: "US", state: "Texas", city: "Dallas" },
  { name: "University of Texas at San Antonio", domain: "utsa.edu", country: "US", state: "Texas", city: "San Antonio" },
  { name: "University of Texas at El Paso", domain: "utep.edu", country: "US", state: "Texas", city: "El Paso" },
  { name: "University of Florida", domain: "ufl.edu", country: "US", state: "Florida", city: "Gainesville" },
  { name: "University of Washington", domain: "washington.edu", country: "US", state: "Washington", city: "Seattle" },
  { name: "University of Wisconsin-Madison", domain: "wisc.edu", country: "US", state: "Wisconsin", city: "Madison" },
  { name: "University of Illinois at Urbana-Champaign", domain: "illinois.edu", country: "US", state: "Illinois", city: "Urbana" },
  { name: "Ohio State University", domain: "osu.edu", country: "US", state: "Ohio", city: "Columbus" },
  { name: "Pennsylvania State University", domain: "psu.edu", country: "US", state: "Pennsylvania", city: "University Park" },
  { name: "University of Georgia", domain: "uga.edu", country: "US", state: "Georgia", city: "Athens" },
  { name: "University of Maryland", domain: "umd.edu", country: "US", state: "Maryland", city: "College Park" },
  { name: "University of California, San Diego", domain: "ucsd.edu", country: "US", state: "California", city: "San Diego" },
  { name: "University of California, Davis", domain: "ucdavis.edu", country: "US", state: "California", city: "Davis" },
  { name: "University of California, Irvine", domain: "uci.edu", country: "US", state: "California", city: "Irvine" },
  { name: "University of California, Santa Barbara", domain: "ucsb.edu", country: "US", state: "California", city: "Santa Barbara" },
  { name: "Purdue University", domain: "purdue.edu", country: "US", state: "Indiana", city: "West Lafayette" },
  { name: "Arizona State University", domain: "asu.edu", country: "US", state: "Arizona", city: "Tempe" },
  { name: "University of Arizona", domain: "arizona.edu", country: "US", state: "Arizona", city: "Tucson" },
  { name: "University of Colorado Boulder", domain: "colorado.edu", country: "US", state: "Colorado", city: "Boulder" },

  // Canadian Universities
  { name: "University of Toronto", domain: "utoronto.ca", country: "Canada", state: "Ontario", city: "Toronto" },
  { name: "McGill University", domain: "mcgill.ca", country: "Canada", state: "Quebec", city: "Montreal" },
  { name: "University of British Columbia", domain: "ubc.ca", country: "Canada", state: "British Columbia", city: "Vancouver" },
  { name: "University of Alberta", domain: "ualberta.ca", country: "Canada", state: "Alberta", city: "Edmonton" },
  { name: "University of Waterloo", domain: "uwaterloo.ca", country: "Canada", state: "Ontario", city: "Waterloo" },
  { name: "McMaster University", domain: "mcmaster.ca", country: "Canada", state: "Ontario", city: "Hamilton" },
  { name: "Queen's University", domain: "queensu.ca", country: "Canada", state: "Ontario", city: "Kingston" },
  { name: "University of Montreal", domain: "umontreal.ca", country: "Canada", state: "Quebec", city: "Montreal" },
  { name: "University of Calgary", domain: "ucalgary.ca", country: "Canada", state: "Alberta", city: "Calgary" },
  { name: "Simon Fraser University", domain: "sfu.ca", country: "Canada", state: "British Columbia", city: "Burnaby" },

  // UK Universities
  { name: "University of Oxford", domain: "ox.ac.uk", country: "UK", city: "Oxford" },
  { name: "University of Cambridge", domain: "cam.ac.uk", country: "UK", city: "Cambridge" },
  { name: "Imperial College London", domain: "imperial.ac.uk", country: "UK", city: "London" },
  { name: "London School of Economics", domain: "lse.ac.uk", country: "UK", city: "London" },
  { name: "University College London", domain: "ucl.ac.uk", country: "UK", city: "London" },
  { name: "King's College London", domain: "kcl.ac.uk", country: "UK", city: "London" },
  { name: "University of Edinburgh", domain: "ed.ac.uk", country: "UK", city: "Edinburgh" },
  { name: "University of Manchester", domain: "manchester.ac.uk", country: "UK", city: "Manchester" },
  { name: "University of Bristol", domain: "bristol.ac.uk", country: "UK", city: "Bristol" },
  { name: "University of Warwick", domain: "warwick.ac.uk", country: "UK", city: "Coventry" },

  // Australian Universities
  { name: "University of Melbourne", domain: "unimelb.edu.au", country: "Australia", city: "Melbourne" },
  { name: "Australian National University", domain: "anu.edu.au", country: "Australia", city: "Canberra" },
  { name: "University of Sydney", domain: "sydney.edu.au", country: "Australia", city: "Sydney" },
  { name: "University of New South Wales", domain: "unsw.edu.au", country: "Australia", city: "Sydney" },
  { name: "University of Queensland", domain: "uq.edu.au", country: "Australia", city: "Brisbane" },
  { name: "Monash University", domain: "monash.edu", country: "Australia", city: "Melbourne" },
  { name: "University of Western Australia", domain: "uwa.edu.au", country: "Australia", city: "Perth" },
  { name: "University of Adelaide", domain: "adelaide.edu.au", country: "Australia", city: "Adelaide" },

  // Major Tech/Engineering Schools
  { name: "Georgia Institute of Technology", domain: "gatech.edu", country: "US", state: "Georgia", city: "Atlanta" },
  { name: "Virginia Tech", domain: "vt.edu", country: "US", state: "Virginia", city: "Blacksburg" },
  { name: "Texas A&M University", domain: "tamu.edu", country: "US", state: "Texas", city: "College Station" },
  { name: "University of California, San Francisco", domain: "ucsf.edu", country: "US", state: "California", city: "San Francisco" },
  { name: "New York University", domain: "nyu.edu", country: "US", state: "New York", city: "New York" },
  { name: "Boston University", domain: "bu.edu", country: "US", state: "Massachusetts", city: "Boston" },
  { name: "University of Southern California", domain: "usc.edu", country: "US", state: "California", city: "Los Angeles" },
  { name: "University of Rochester", domain: "rochester.edu", country: "US", state: "New York", city: "Rochester" },
  { name: "Case Western Reserve University", domain: "case.edu", country: "US", state: "Ohio", city: "Cleveland" },
  { name: "Rensselaer Polytechnic Institute", domain: "rpi.edu", country: "US", state: "New York", city: "Troy" },

  // Community Colleges & Other Schools
  { name: "Santa Monica College", domain: "smc.edu", country: "US", state: "California", city: "Santa Monica" },
  { name: "De Anza College", domain: "deanza.edu", country: "US", state: "California", city: "Cupertino" },
  { name: "Pierce College", domain: "piercecollege.edu", country: "US", state: "California", city: "Woodland Hills" },
  { name: "Pasadena City College", domain: "pasadena.edu", country: "US", state: "California", city: "Pasadena" },
]

export function searchSchools(query: string): School[] {
  if (!query || query.length < 2) return schools.slice(0, 20) // Show first 20 by default
  
  const lowercaseQuery = query.toLowerCase()
  return schools
    .filter(school => 
      school.name.toLowerCase().includes(lowercaseQuery) ||
      school.city?.toLowerCase().includes(lowercaseQuery) ||
      school.state?.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, 10) // Limit to 10 results for performance
}

export function getSchoolLogo(domain: string): string {
  return `https://logo.clearbit.com/${domain}`
} 