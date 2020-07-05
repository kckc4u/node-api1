let test = {
    friends: ['Shaym', 'Jaju'],
    name: 'Vinod',
    listAllFrinds: function() {
        // Here this refers to current object
        console.log('Inside listAllFriends', this);
        var that = this;
        this.friends.map(function(frnd) {
            console.log('Inside listAllFriends -> callback for map function (old school practice)', this);
            // here this is not traciable so return undefined
            console.log(`${frnd} is friend with ${this.name}.`);

            console.log(' ===== After assign this to another variable. ===== ');
            // Here by using clouser we can access this (that)
            console.log(`${frnd} is friend with ${that.name}.`);
        });

        // Using arrow method here
        this.exp.map((company) => {
            console.log('nside listAllFriends -> arrow style callback function', this);
            console.log(`${this.name} worked with ${company}`);
        })

    },
    exp: ['Lucenta', 'A3Logics', 'SF', 'SG'],
    workedWith: () => {
        // Here this is not accessible 
        console.log('Inside workedWith: ', this);
    }
}

console.log('Global Context: ', this);
test.listAllFrinds();
test.workedWith();