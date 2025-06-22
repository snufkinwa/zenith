interface AWSConfig {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    mandatorySignIn: boolean;
  };
  API: {
    GraphQL: {
      endpoint: string;
      region: string;
      defaultAuthMode: string;
    };
  };
  Storage: {
    S3: {
      bucket: string;
      region: string;
    };
  };
}

const awsconfig: AWSConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
    mandatorySignIn: true,
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_ENDPOINT!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      defaultAuthMode: 'AMAZON_COGNITO_USER_POOLS'
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!
    }
  }
};

export default awsconfig;