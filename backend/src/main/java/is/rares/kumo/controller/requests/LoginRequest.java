package is.rares.kumo.controller.requests;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import is.rares.kumo.security.model.ClientLocationModel;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@ApiModel(description = "Login request object")
public class LoginRequest {
    @NotNull(message = "Username must not be empty")
    @ApiModelProperty(notes = "The account username")
    @Size(min = 6, max = 25, message = "Username needs to be between 6 and 25 characters")
    String username;

    @NotNull(message = "Password must not be empty")
    @ApiModelProperty(notes = "The account password")
    @Size(min = 6, max = 35, message = "Password needs to be between 6 and 35 characters")
    @Pattern(regexp = "(?=.*[A-Z])(?=.*[a-z]).*", message = "Password must have at least one uppercase and one lowercase character")
    String password;

    @NotNull(message = "Client location missing")
    @ApiModelProperty(notes = "The client's location")
    ClientLocationModel clientLocation;
}