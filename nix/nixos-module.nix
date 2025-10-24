{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.openxai-signables;
  openxai-signables = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.openxai-signables = {
      enable = lib.mkEnableOption "Enable the nextjs app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        example = 3000;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.groups.openxai-signables = { };
    users.users.openxai-signables = {
      isSystemUser = true;
      group = "openxai-signables";
    };

    systemd.services.openxai-signables = {
      wantedBy = [ "multi-user.target" ];
      description = "View OpenxAI signables.";
      after = [ "network.target" ];
      environment = {
        HOSTNAME = cfg.hostname;
        PORT = toString cfg.port;
      };
      serviceConfig = {
        ExecStart = "${lib.getExe openxai-signables}";
        User = "openxai-signables";
        Group = "openxai-signables";
        CacheDirectory = "nextjs-app";
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port ];
    };
  };
}
