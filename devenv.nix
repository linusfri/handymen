{
  pkgs,
  ...
}:

{
  config = {
    env = {
      /**
        Request over http (no ssl), certificate not valid for LAN adresses.
      */
      EXPO_PUBLIC_API_URL = "https://handy-gleam-local.friikod.se";
      EXPO_PUBLIC_APP_LOCALE = "sv-SE";
    };

    packages = with pkgs; [
      nodejs_22
      eas-cli
    ];

    languages = {
      typescript.enable = true;
      java.enable = true;
    };

    scripts.set-environment.exec = ''
      ANDROID_HOME=$(find ~ -maxdepth 1 -type d -name "Android")
      NETWORK_HOST=$(get-network-host) # Comes from templates repo

      if [[ -z $ANDROID_HOME ]]; then
        echo "Could not find Android folder in $HOME"
        exit 1
      fi

      if [[ -d "$ANDROID_HOME/Sdk" ]]; then
        SDK_PATH="Sdk"
      elif [[ -d "$ANDROID_HOME/sdk" ]]; then
        SDK_PATH="sdk"
      else
        echo "Sdk folder not found in $ANDROID_HOME"
        exit 1
      fi

      cat <<EOF > devenv.local.nix
      {
      ...
      }:
      {
        config = {
          env = {
            /**
              Request over http (no ssl), certificate not valid for LAN adresses.
            */
            ANDROID_HOME = "$ANDROID_HOME/$SDK_PATH";
            EXPO_PUBLIC_LOCAL_API_URL = "$NETWORK_HOST";
          };
        };
      }
      EOF
    '';

    scripts.lint.exec = ''npx eslint $@'';

    git-hooks = {
      enable = true;
      hooks = {
        expo-lint = {
          enable = true;
          name = "eslint";
          entry = "npx eslint";
          language = "system";
        };
      };
    };
  };
}
