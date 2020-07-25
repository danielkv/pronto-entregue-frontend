const rewireReactHotLoader = require('react-app-rewire-hot-loader')

const { useBabelRc, override } = require('customize-cra');

/* config-overrides.js */
module.exports = override(
	useBabelRc(),
	(config, env) => {
		config = rewireReactHotLoader(config, env);
		
		config.resolve.alias = {
			...config.resolve.alias,
			'react-dom': '@hot-loader/react-dom'
		}
		
		return config
	}
)