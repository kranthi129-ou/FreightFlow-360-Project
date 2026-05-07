package backend.dto;

public class SetupStatusResponse {

    private boolean setupRequired;

    public SetupStatusResponse(boolean setupRequired) {
        this.setupRequired = setupRequired;
    }

    public boolean isSetupRequired() {
        return setupRequired;
    }
}