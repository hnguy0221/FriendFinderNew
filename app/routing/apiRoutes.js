var friendData = require("../data/friends");

module.exports = function(app) 
{
    //API GET Requests
    //Below code handles when users "visit" a page.
    //In each of the below cases when a user visits a link
    //(ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------
    app.get("/api/friends", function(req, res) {
        res.json(friendData);
    });

    //API POST Requests
    //Below code handles when a user submits a form and thus submits data to the server.
    //When a user submits form data (a JSON object), ex. the user fills out the survey 
    //... this data is then sent to the server...Then the server calculates the user's 
    //most compatible friend using following guideline:
    //Convert each user's results into a simple array of numbers 
    //(ex: `[5, 1, 4, 4, 5, 1, 2, 5, 4, 1]`).
    //With that done, compare the difference between current user's scores against those 
    //from other users, question by question. Add up the differences to calculate 
    //the `totalDifference`.
    //Example: 
    //User 1: `[5, 1, 4, 4, 5, 1, 2, 5, 4, 1]`
    //User 2: `[3, 2, 6, 4, 5, 1, 2, 5, 4, 1]`
    //Total Difference: **2 + 1 + 2 =** **_5_**
    //Remember to use the absolute value of the differences. Put another way: no negative 
    //solutions! Your app should calculate both `5-3` and `3-5` as `2`, and so on. 
    //The closest match will be the user with the least amount of difference.)
    // ---------------------------------------------------------------------------
    app.post("/api/friends", function(req, res) {
        var reqData = req.body;
        var reqScores = reqData.scores;
        var resData;
        var totalDifference = 0;
        var currScores = friendData[0].scores;
        for (var i = 0; i < currScores.length; i++)
        {
            totalDifference += Math.abs(parseInt(reqScores[i]) - parseInt(currScores[i]));
        }
        resData = friendData[0];
        for (var i = 1; i < friendData.length; i++) 
        {
            var scores = friendData[i].scores;
            var nextTotalDifference = 0;
            for (var j = 0; j < scores.length; j++)
            {
                nextTotalDifference += Math.abs(parseInt(reqScores[j]) - parseInt(scores[j]));
            }
            if (nextTotalDifference < totalDifference)
            {
                totalDifference = nextTotalDifference;
                resData = friendData[i];
            }
        }
        friendData.push(reqData);
        res.json(resData);
    });
}
