import { ApolloClient, ApolloProvider, from, fromPromise, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';
import { Auth } from 'firebase/auth';
import React, { ReactNode } from 'react';

type Props = {
	children: ReactNode;
	auth: Auth;
	LoadingScreen: ReactNode;
	LoginScreen: ReactNode;
	backend_url: string;
	backend_ws_url: string;
	is_dev?: boolean;
}

export const ProvideApollo = ({
	auth,
	LoadingScreen,
	LoginScreen,
	backend_url,
	backend_ws_url,
	is_dev,
	children,
}: Props) => {
	const [is_ready, setIsReady] = React.useState(false);
	const [id_token, setIdToken] = React.useState<string>();
	const [user_id, setUserId] = React.useState<string>();

	React.useEffect(() => {
		const sub = auth.onAuthStateChanged(async (firebase_user) => {
			setIsReady(true);
			if (!firebase_user) {
				setIdToken(undefined);
				setUserId(undefined);
				return;
			}
			setUserId(firebase_user.uid);
			const result = await firebase_user.getIdTokenResult();
			setIdToken(result.token);
		});
		return () => sub();
	}, []);

	const onRefresh = async (persist?: boolean) => {
		const id_token = await auth.currentUser?.getIdToken(true);
		if (persist) {
			setIdToken(id_token);
		}
		return id_token;
	}

	const client = React.useMemo(() => {
		return initApolloClient({ onRefresh, auth, backend_url, backend_ws_url, is_dev });
	}, [id_token]);


	if (!is_ready || !client) {
		return <>{LoadingScreen}</>
	}
	if (!user_id) {
		return <>{LoginScreen}</>
	}

	return <ApolloProvider
		client={client}>
		{children}
	</ApolloProvider>
}

const initApolloClient = ({
	auth,
	onRefresh,
	backend_url,
	backend_ws_url,
	is_dev,
}: {
	auth: Auth
	onRefresh: (persist?: boolean) => Promise<string | undefined>;
	backend_url: string;
	backend_ws_url: string;
	is_dev?: boolean
}) => {
	let isRefreshing = false;
	let pendingRequests: any = [];
	const resolvePendingRequests = () => {
		pendingRequests.map((callback: any) => callback());
		pendingRequests = [];
	};
	const errorLink = onError(
		({ networkError, graphQLErrors, operation, forward }) => {
			if (networkError) {
				const err = networkError as any;
				const code = err && err.extensions && err.extensions.code;
				if (code === "start-failed") {
					console.error("Network: websocket start failed:", err.message);
				}
				console.error('Network error:', err);
				return;
			}
			if (graphQLErrors && graphQLErrors
				.findIndex(error => error.message === 'Could not verify JWT: JWTExpired') > -1) {
				let forward$;
				if (!isRefreshing) {
					isRefreshing = true;
					console.info('Refreshing token');
					forward$ = fromPromise(
						onRefresh(true)
							.then(() => {
								return true;
							})
							.then(() => {
								resolvePendingRequests();
								return true;
							})
							.catch(() => {
								pendingRequests = [];
								return false;
							})
							.finally(() => {
								isRefreshing = false;
							})
					);
				} else {
					forward$ = fromPromise(
						new Promise(resolve => {
							pendingRequests.push(() => resolve(0));
						})
					);
				}
				return forward$.flatMap(() => {
					return forward(operation);
				}) as any;
			}
		}
	);

	const authLink = setContext(async (operation, { headers }) => {
		const current_user = auth.currentUser;
		if (!current_user) {
			return {
				headers: {},
			}
		}
		return current_user.getIdToken()
			.then((token) => {
				return {
					headers: {
						...headers,
						authorization: token ? `Bearer ${token}` : ''
					}
				}
			})
	});

	const httpLink = new HttpLink({
		uri: backend_url,
	});

	const wsLink = new WebSocketLink({
		uri: backend_ws_url,
		options: {
			reconnect: true,
			lazy: true,
			connectionParams: async () => {
				const id_token = await onRefresh(false);
				if (!id_token) {
					return;
				}
				return {
					headers: {
						Authorization: `Bearer ${id_token}`,
					},
				}
			},
		}
	});

	const link = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			)
		},
		wsLink,
		from([authLink, httpLink]),
	);

	return new ApolloClient({
		link: from([errorLink, link]),
		connectToDevTools: is_dev,
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						incubation_batch: {
							keyArgs: false,
							merge(existing, incoming, { readField }) {
								const merged = { ...existing };
								incoming.forEach((item: any) => {
									merged[readField<number>("id", item) as number] = item;
								});
								return merged;
							},
							read(existing) {
								return existing && Object.values(existing).reverse();
							},
						},
						steri_cycle: {
							keyArgs: false,
							merge(existing, incoming, { readField }) {
								const merged = { ...existing };
								incoming.forEach((item: any) => {
									merged[readField<number>("id", item) as number] = item;
								});
								return merged;
							},
							read(existing) {
								return existing && Object.values(existing).reverse();
							},
						}
					}
				}
			}
		}),
	});
}
