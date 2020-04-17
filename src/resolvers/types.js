import gql from "graphql-tag";

export default gql`
	input OrderCreatedInput {
		id: ID!
		type: String!
		user: UserInput
		products: [OrderCreatedProduct]!
		paymentMethod: PaymentMethodInput!
		deliveryPrice: Float!
		deliveryTime: Int!
		price: Float!
		discount: Float!
		status: String!
		message: String!
		createdAt: DateTime!
		address: AddressInput!
	}

	input OrderCreatedProduct {
		id: ID!
		name: String!
		image: String!
		price: Float!
		
		productRelated: ProductInput!
		
		optionsGroups: [OptionsGroupInput]
	}
`;