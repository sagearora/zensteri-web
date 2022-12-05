
export function parseServerError(error: any) {
	// console.log(JSON.stringify(error, null, 2));
	try {
		if (!!error && typeof error === 'object') {
			if (error.networkError) {
				return {
					message: error.networkError.message,
				}
			}
			if (!!error.graphQLErrors) {
				const [e] = error.graphQLErrors;
				console.log('here', e);
				if (e.message) {
					if (e.message === 'database query error') {
						return {
							message: e.extensions?.internal?.error?.message,
						}
					}
					return {
						message: e.message.replace(/String/g, '').replace(/"/g, ''),
					};
				}
			}
		}
	} catch (e) { }
	return {
		message: JSON.stringify(error),
	};
}