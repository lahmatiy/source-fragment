module.exports = function hello() {
    return (
        'world' +
        '!!!'
    );
};

global.call(
	global.nested(
		1,
		// next line should contain whitespaces
    
        // next line should not contain a whitespaces

        2
	)
);
