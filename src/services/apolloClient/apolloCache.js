import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({});

export const initialData = {
	loggedUserId: null,
	loadingInit: true,
	initialized: false,
	isUserLoggedIn: false,
	userToken: null,
	ordersRoll: [],
	selectedCompany: localStorage.getItem('@prontoentregue/selectedCompany') || '',
}

cache.writeData({ data: initialData });

export default cache;