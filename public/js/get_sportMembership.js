// Retrieve data for that specifc membership
function getSportMembership(sportMembershipID){
    let url = `/edit-sport-membership-view?id=${sportMembershipID}`;

    window.location.href = url;
};