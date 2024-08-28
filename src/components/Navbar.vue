<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary"
        style="background: linear-gradient(to right, #48BB78, #4299E1);">
        <div class="container">
            <RouterLink to="/" class="navbar-brand big-title">
                KenBlitz
            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0" v-if="username">
                    <li class="nav-item dropdown">

                        <RouterLink to="/">
                            <button type="button" class="nav-link dropdown-toggle" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                {{ username }}
                            </button>
                        </RouterLink>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink to="/logout">
                                    <button type="button" class="dropdown-item">Logout</button>
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0" v-else>
                    <li class="nav-item">
                        <RouterLink to="/register">
                            <button type="button" class="nav-link">Register</button>
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/login">
                            <button type="button" class="nav-link">Login</button>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: {
        username: { required: false, type: String },
    }
}
</script>

<style scoped>
.big-title {
    font-size: 2rem; /* Adjust the size as needed */
    font-weight: bold;
    text-decoration: none; /* Remove underline */
}

.navbar-brand {
    text-decoration: none; /* Ensure no underline on link */
    color: inherit; /* Preserve text color */
}
</style>
